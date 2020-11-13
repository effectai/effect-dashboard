import Vue from 'vue'

export default (context, inject) => {
  const wallet = new Vue({
    data () {
      return {
        wallet: null,

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

        timer: null,
        updater: null,
        refreshStakeAge: true
      }
    },

    computed: {
      eos () {
        return context.$eos
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
        const age = this.lastClaimAge
        const limit = 200 * 24 * 3600
        const newAge = Math.min(limit, age + diffSeconds)
        const avgAge = ((age + newAge) / 2) * Math.min(1, 1 - ((diffSeconds - (limit - age)) / diffSeconds)) + newAge * Math.max(0, (diffSeconds - (limit - age)) / diffSeconds)

        return Math.floor(((this.efxStaked * diffSeconds * avgAge / 86400) / (1000000 * 24 * 3600)) * 10000) / 10000
      },

      // Stake age of EFX
      stakeAge () {
        // eslint-disable-next-line
        this.refreshStakeAge
        if (!this.efxStaked) {
          return 0
        }

        // Add 'Z' for UTC time
        let lastClaimTime = new Date(`${this.efxLastClaimTime}Z`)
        const claimStopTime = new Date(1604188799 * 1000)
        let limit = 1000 * 24 * 3600
        let now = new Date()
        let age = this.efxLastClaimAge
        if (lastClaimTime < claimStopTime) {
          limit = 200 * 24 * 3600
          if (now > claimStopTime) {
            now = claimStopTime
            const diffTime = Math.abs(now.getTime() - lastClaimTime.getTime())
            const diffSeconds = diffTime / 1000
            age = Math.min(limit, this.efxLastClaimAge + diffSeconds)
            lastClaimTime = now
            limit = 1000 * 24 * 3600
            now = new Date()
          }
        }

        const diffTime = Math.abs(now.getTime() - lastClaimTime.getTime())
        const diffSeconds = diffTime / 1000
        return Math.min(limit, age + diffSeconds)
      },

      power () {
        return parseFloat(this.efxStaked) + parseFloat((this.stakeAge / (200 * 24 * 3600)) * this.efxStaked)
      },

      efxCanRefund () {
        return this.efxUnstaking > 0 && new Date(`${this.efxUnstakingTime}Z`) < new Date()
      },

      nfxCanRefund () {
        return this.nfxUnstaking > 0 && new Date(`${this.nfxUnstakingTime}Z`) < new Date()
      }
    },

    created () {
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

      updateAccount () {
        this.getAccountBalance()
        this.getStakes()
        this.getUnstakes()
      },

      clear () {
        Object.assign(this.$data, this.$options.data.call(this))
      },

      async getAccountBalance () {
        if (this.wallet) {
          this.efxAvailable = parseFloat((await this.eos.rpc.get_currency_balance(process.env.tokenContract, this.wallet.auth.accountName, process.env.efxToken))[0].replace(` ${process.env.efxToken}`, ''))
          this.nfxAvailable = parseFloat((await this.eos.rpc.get_currency_balance(process.env.tokenContract, this.wallet.auth.accountName, process.env.nfxToken))[0].replace(` ${process.env.nfxToken}`, ''))
        }
      },

      async getStakes () {
        if (this.wallet) {
          await this.eos.rpc.get_table_rows({
            code: process.env.stakingContract,
            scope: this.wallet.auth.accountName,
            table: 'stake'
          }).then((data) => {
            data.rows.map((row) => {
              if (row.amount.includes(process.env.efxToken)) {
                this.efxStaked = parseFloat(row.amount.replace(` ${process.env.efxToken}`, '').replace('.', ','))
                this.efxLastClaimTime = row.last_claim_time
                this.efxLastClaimAge = row.last_claim_age
              } else if (row.amount.includes(process.env.nfxToken)) {
                this.nfxStaked = parseFloat(row.amount.replace(` ${process.env.nfxToken}`, '').replace('.', ','))
              }
            })
          })
        }
      },

      async getUnstakes () {
        if (this.wallet) {
          await this.eos.rpc.get_table_rows({
            code: process.env.stakingContract,
            scope: this.wallet.auth.accountName,
            table: 'unstake'
          }).then((data) => {
            data.rows.map((row) => {
              if (row.amount.includes(process.env.efxToken)) {
                this.efxUnstaking = parseFloat(row.amount.replace(` ${process.env.efxToken}`, '').replace('.', ','))
                this.efxUnstakingTime = row.time
              } else if (row.amount.includes(process.env.nfxToken)) {
                this.nfxUnstaking = parseFloat(row.amount.replace(` ${process.env.nfxToken}`, '').replace('.', ','))
                this.nfxUnstakingTime = row.time
              }
            })
          })
        }
      }
    }
  })

  inject('wallet', wallet)
}
