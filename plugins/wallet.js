import Vue from 'vue'

export default (context, inject) => {
  const wallet = new Vue({
    data () {
      return {
        wallet: null,
        loginModal: false,
        efxAvailable: 0,
        efxStaked: 0,
        efxLastClaimTime: null,
        efxLastClaimAge: null,
        efxUnstaking: 0,
        efxUnstakingTime: null,

        nfxAvailable: 0,
        nfxStaked: 0,
        nfxUnstaking: 0,
        nfxUnstakingTime: null,

        signedConstitution: false,
        signedConstitutionVersion: 0,

        timer: null,
        updater: null,
        refreshStakeAge: true,

        transaction: null,
        transactionError: null
      }
    },

    computed: {
      eos () {
        return context.$eos
      },

      airdrop () {
        return context.$airdrop
      },

      genesisAirdrop () {
        return (this.wallet && this.wallet.auth && this.airdrop.genesis[this.wallet.auth.accountName]) ? this.airdrop.genesis[this.wallet.auth.accountName].amount : 0
      },

      // Check if user still has unclaimed NFX before NFX generation stop date
      nfxStillClaimable () {
        if (!this.efxStaked) {
          return 0
        }

        const lastClaimTime = new Date(`${this.efxLastClaimTime}Z`)
        const claimStopTime = new Date(1604188799 * 1000)
        let now = new Date()
        if (now > claimStopTime) {
          now = claimStopTime
        }
        const diffTime = now.getTime() - lastClaimTime.getTime()
        const diffSeconds = diffTime / 1000
        if (diffSeconds < 0) {
          return 0
        }
        const age = this.efxLastClaimAge
        const limit = 200 * 24 * 3600
        const newAge = Math.min(limit, age + diffSeconds)
        const avgAge = ((age + newAge) / 2) * Math.min(1, 1 - ((diffSeconds - (limit - age)) / diffSeconds)) + newAge * Math.max(0, (diffSeconds - (limit - age)) / diffSeconds)

        return Math.floor(((this.efxStaked * diffSeconds * avgAge / 86400) / (1000000 * 24 * 3600)) * 10000) / 10000
      },

      // Stake age of EFX
      stakeAge () {
        // eslint-disable-next-line
        this.refreshStakeAge
        return this.calculateStakeAge(this.efxStaked, this.efxLastClaimTime, this.efxLastClaimAge)
      },

      power () {
        return this.calculateEfxPower(this.efxStaked, this.stakeAge)
      },

      rank () {
        return this.calculateRankProgress(this.power, this.nfxStaked)
      },

      efxCanRefund () {
        return this.efxUnstaking > 0 && new Date(`${this.efxUnstakingTime}Z`) < new Date()
      },

      nfxCanRefund () {
        return this.nfxUnstaking > 0 && new Date(`${this.nfxUnstakingTime}Z`) < new Date()
      }
    },

    created () {
      console.log('created wallet')
      this.timer = setInterval(() => { this.refreshStakeAge = !this.refreshStakeAge }, 1000)
      this.updater = setInterval(() => { this.updateAccount() }, 10000)
    },

    beforeDestroy () {
      clearInterval(this.timer)
      clearInterval(this.updater)
    },

    methods: {
      init (wallet) {
        this.wallet = wallet
        this.updateAccount()
      },

      bytesToHex (bytes) {
        let hex = ''
        for (const b of bytes) {
          const n = Number(b).toString(16)
          hex += (n.length === 1 ? '0' : '') + n
        }
        return hex
      },

      calculateRankProgress (power, nfxStaked) {
        if (!power) {
          power = 0
        }
        if (!nfxStaked) {
          nfxStaked = 0
        }
        const rankRequirements = [
          {
            power: 0,
            nfx: 0
          },
          {
            power: 200000,
            nfx: 10000
          },
          {
            power: 348326,
            nfx: 15505
          },
          {
            power: 606655,
            nfx: 24041
          },
          {
            power: 1056569,
            nfx: 37276
          },
          {
            power: 1840152,
            nfx: 57797
          },
          {
            power: 3204864,
            nfx: 89615
          },
          {
            power: 5581687,
            nfx: 138950
          },
          {
            power: 9721233,
            nfx: 215443
          },
          {
            power: 16930792,
            nfx: 334048
          },
          {
            power: 29487176,
            nfx: 517947
          }
        ]
        let currentRequirements
        let currentRank
        let nextRank
        for (let rank = 0; rank < rankRequirements.length; rank++) {
          if (power >= rankRequirements[rank].power && nfxStaked >= rankRequirements[rank].nfx) {
            currentRank = rank
            currentRequirements = rankRequirements[rank]
            nextRank = rankRequirements[rank + 1]
          } else {
            break
          }
        }
        return { currentRank, currentRequirements, nextRank }
      },

      calculateEfxPower (efxStaked, stakeAge) {
        return parseFloat(efxStaked) + parseFloat((stakeAge / (200 * 24 * 3600)) * efxStaked)
      },

      calculateStakeAge (efxStaked, efxLastClaimTime, efxLastClaimAge) {
        if (!efxStaked) {
          return 0
        }

        // Add 'Z' for UTC time
        let lastClaimTime = new Date(`${efxLastClaimTime}Z`)
        const claimStopTime = new Date(1604188799 * 1000)
        let limit = 1000 * 24 * 3600
        let now = new Date()
        let age = efxLastClaimAge
        if (lastClaimTime < claimStopTime) {
          limit = 200 * 24 * 3600
          if (now > claimStopTime) {
            now = claimStopTime
            const diffTime = Math.abs(now.getTime() - lastClaimTime.getTime())
            const diffSeconds = diffTime / 1000
            age = Math.min(limit, efxLastClaimAge + diffSeconds)
            lastClaimTime = now
            limit = 1000 * 24 * 3600
            now = new Date()
          }
        }

        const diffTime = Math.abs(now.getTime() - lastClaimTime.getTime())
        const diffSeconds = diffTime / 1000
        return Math.min(limit, age + diffSeconds)
      },

      updateAccount () {
        if (this.wallet) {
          this.getAccountBalance()
          this.getMyStakes()
          this.getMyUnstakes()
          this.checkIfSigned()
        }
      },

      clear () {
        this.clearTransaction()
        Object.assign(this.$data, this.$options.data.call(this))
      },

      async getAccountBalance () {
        if (this.wallet) {
          const efxRow = (await this.eos.rpc.get_currency_balance(process.env.tokenContract, this.wallet.auth.accountName, process.env.efxToken))[0]
          if (efxRow) {
            this.efxAvailable = parseFloat(efxRow.replace(` ${process.env.efxToken}`, ''))
          }
          const nfxRow = (await this.eos.rpc.get_currency_balance(process.env.tokenContract, this.wallet.auth.accountName, process.env.nfxToken))[0]
          if (nfxRow) {
            this.nfxAvailable = parseFloat(nfxRow.replace(` ${process.env.nfxToken}`, ''))
          }
        }
      },

      async getMyStakes () {
        if (this.wallet) {
          const stakes = await this.getStake()
          stakes.map((row) => {
            if (row.amount.includes(process.env.efxToken)) {
              this.efxStaked = parseFloat(row.amount.replace(` ${process.env.efxToken}`, ''))
              this.efxLastClaimTime = row.last_claim_time
              this.efxLastClaimAge = row.last_claim_age
            } else if (row.amount.includes(process.env.nfxToken)) {
              this.nfxStaked = parseFloat(row.amount.replace(` ${process.env.nfxToken}`, ''))
            }
          })
        }
      },

      async getStake () {
        const data = await this.eos.rpc.get_table_rows({
          code: process.env.stakingContract,
          scope: ' ' + this.wallet.auth.accountName,
          key_type: 'i64',
          table: 'stake'
        })
        return data.rows
      },

      async getMyUnstakes () {
        if (this.wallet) {
          await this.eos.rpc.get_table_rows({
            code: process.env.stakingContract,
            scope: ' ' + this.wallet.auth.accountName,
            table: 'unstake'
          }).then((data) => {
            data.rows.map((row) => {
              if (row.amount.includes(process.env.efxToken)) {
                this.efxUnstaking = parseFloat(row.amount.replace(` ${process.env.efxToken}`, ''))
                this.efxUnstakingTime = row.time
              } else if (row.amount.includes(process.env.nfxToken)) {
                this.nfxUnstaking = parseFloat(row.amount.replace(` ${process.env.nfxToken}`, ''))
                this.nfxUnstakingTime = row.time
              }
            })
          })
        }
      },

      async checkIfSigned () {
        if (this.wallet) {
          const member = await this.getDaoMember(this.wallet.auth.accountName)
          this.signedConstitution = !!member
          if (this.signedConstitution) {
            this.signedConstitutionVersion = member.agreedtermsversion
          }
        }
      },

      async getDaoMember (accountName) {
        const response = await this.eos.rpc.get_table_rows({
          code: process.env.daoContract,
          scope: process.env.daoContract,
          lower_bound: ' ' + accountName,
          upper_bound: ' ' + accountName,
          table: 'member',
          limit: 1
        })

        return response.rows ? response.rows[0] : null
      },

      handleTransaction (actions) {
        this.clearTransaction()

        return this.wallet.eosApi.transact({ actions }, {
          blocksBehind: 3,
          expireSeconds: 60
        })
          .then((transaction) => {
            this.transaction = transaction
            return Promise.resolve(transaction)
          })
          .catch((error) => {
            this.transactionError = error
            return Promise.reject(error)
          })
      },

      clearTransaction () {
        this.transaction = null
        this.transactionError = null
      }
    }
  })

  inject('wallet', wallet)
}
