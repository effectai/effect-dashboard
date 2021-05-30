(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{694:function(t,e,o){var content=o(698);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(58).default)("4feda3ac",content,!0,{sourceMap:!1})},695:function(t,e,o){"use strict";o.r(e);var n={filters:{truncate:function(t,e){return t.length<=e?t:t.substring(0,e)+"…"}},props:["proposals"],data:function(){return{voteTypes:[{value:1,name:"Y"},{value:0,name:"A"},{value:2,name:"N"}],categories:{0:"Governance Proposal",1:"Marketing",2:"Design",3:"Technical",4:"Other"}}}},r=(o(697),o(25)),component=Object(r.a)(n,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return t.proposals?o("div",{staticClass:"proposals"},[t.proposals.length>0?o("div",t._l(t.proposals,(function(e){return o("nuxt-link",{key:e.id,staticClass:"box has-shadow-outside is-narrow",attrs:{to:"/proposals/"+e.id}},[o("div",{staticClass:"columns is-desktop is-gapless"},[o("div",{staticClass:"has-text-weight-light column is-four-fifths-desktop"},[e.title?o("b",[t._v("#"+t._s(e.id)+": "+t._s(t._f("truncate")(e.title,60)))]):o("b",[t._v("...")]),t._v(" "),o("div",{staticClass:"has-text-weight-light"},[o("small",{staticClass:"mr-1"},[t._v("by "),o("nuxt-link",{attrs:{to:"/account/"+e.author}},[t._v(t._s(e.author))])],1),t._v(" "),o("small",[t._v("requesting "),t._l(e.pay,(function(e,n){return o("span",{key:n},[n>0?o("span",[t._v(",")]):t._e(),t._v(" "+t._s(parseInt(e.field_0.quantity))+" EFX")])}))],2)])]),t._v(" "),o("div",{staticClass:"column is-one-fifths-desktop has-text-left-mobile has-text-right-desktop"},[o("span",{staticClass:"tag",class:{"is-success":"ACTIVE"==e.status,"is-warning":"DRAFT"==e.status,"is-link":"PENDING"==e.status,"is-dark":"CLOSED"==e.status}},[t._v(t._s(e.status))]),t._v(" "),e.cycle?o("span",{staticClass:"tag is-info"},[t._v("C"+t._s(e.cycle))]):t._e(),t._v(" "),3===e.state?o("span",{staticClass:"tag is-success"},[t._v("EXECUTED")]):t._e(),t._v(" "),2===e.state?o("span",{staticClass:"tag is-danger"},[t._v("REJECTED")]):t._e(),t._v(" "),1===e.state?o("span",{staticClass:"tag is-success"},[t._v("ACCEPTED")]):t._e(),t._v(" "),"ACTIVE"===e.status||"CLOSED"===e.status?o("div",{staticClass:"is-size-7"},t._l(e.vote_counts,(function(e){return o("span",{key:e.key,staticClass:"vote-result"},[o("small",[o("b",{class:{"has-text-success":1===e.key,"has-text-danger":2===e.key}},[t._v(t._s(t.voteTypes.find((function(t){return t.value==e.key})).name)+": "+t._s(e.value))])])])})),0):t._e()])])])})),1):o("h5",{staticClass:"has-text-centered subtitle"},[t._v("\n    No Proposals\n  ")])]):t._e()}),[],!1,null,"afac8988",null);e.default=component.exports},697:function(t,e,o){"use strict";o(694)},698:function(t,e,o){(e=o(57)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap);"]),e.push([t.i,"@import url(https://use.typekit.net/kej5qyk.css);"]),e.push([t.i,'.proposals .media-left[data-v-afac8988]{min-width:72px}.vote-result[data-v-afac8988]:after{content:" - "}.vote-result[data-v-afac8988]:last-of-type:after{content:""}.media[data-v-afac8988]{flex-wrap:wrap}',""]),t.exports=e},775:function(t,e,o){"use strict";o.r(e);o(36),o(78),o(59),o(70),o(44);var n=o(3),r=o(695),l=o(177),c={components:{Proposals:r.default,ConnectWallet:l.default},data:function(){return{filter:"ACTIVE",statuses:[{id:"ACTIVE",name:"Active"},{id:"PENDING",name:"Pending"},{id:"DRAFT",name:"Draft"},{id:"PROCESSING",name:"Processing"},{id:"CLOSED",name:"Closed"},{id:"ALL",name:"All"}],loading:!1,proposals:null,moreProposals:null,nextKey:null}},computed:{wallet:function(){return this.$wallet?this.$wallet.wallet:null},proposalsFiltered:function(){var t=this;if("ACTIVE"===this.filter)return this.proposals.filter((function(t){return"ACTIVE"===t.status||"PENDING"===t.status}));var e=this.proposals.filter((function(e){return!t.filter||"ALL"===t.filter||e.status===t.filter})),o=e.filter((function(t){return"ACTIVE"===t.status})).reverse(),n=e.filter((function(t){return"PENDING"===t.status})).reverse(),r=e.filter((function(t){return"PROCESSING"===t.status})).reverse(),l=e.filter((function(t){return"DRAFT"===t.status})).reverse(),c=e.filter((function(t){return"CLOSED"===t.status})).reverse();return[].concat(o,n,r,l,c)},currentCycle:function(){return this.$dao.proposalConfig?this.$dao.proposalConfig.current_cycle:null}},watch:{currentCycle:function(){this.getProposals()}},created:function(){this.getProposals()},methods:{getProposals:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var o,data;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.loading=!0,!t.$dao.proposalConfig){e.next=19;break}return e.prev=2,o={code:"daoproposals",scope:"daoproposals",table:"proposal",limit:20},t.nextKey&&(o.lower_bound=t.nextKey),e.next=7,t.$eos.rpc.get_table_rows(o);case 7:data=e.sent,t.moreProposals=data.more,t.nextKey=data.next_key,t.proposals?t.proposals=t.proposals.concat(data.rows):t.proposals=data.rows,t.proposals.forEach(function(){var e=Object(n.a)(regeneratorRuntime.mark((function e(o){var n,r,l;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o.status){e.next=12;break}if(n="CLOSED",0!==o.state){e.next=11;break}if(o.cycle){e.next=7;break}n="DRAFT",e.next=11;break;case 7:return e.next=9,t.$dao.getCycleConfig(o.cycle);case 9:r=e.sent,n=r&&o.cycle===t.$dao.proposalConfig.current_cycle&&t.$moment(r.start_time+"Z").add(t.$dao.proposalConfig.cycle_voting_duration_sec,"seconds").isAfter()?"ACTIVE":r&&t.$moment(r.start_time+"Z").add(t.$dao.proposalConfig.cycle_voting_duration_sec,"seconds").isBefore()||r&&o.cycle<t.currentCycle?"PROCESSING":"PENDING";case 11:t.$set(o,"status",n);case 12:if(o.title){e.next=23;break}return e.prev=13,e.next=16,t.$dao.getIpfsProposal(o.content_hash);case 16:l=e.sent,t.$set(o,"title",l.title),e.next=23;break;case 20:e.prev=20,e.t0=e.catch(13),console.error(e.t0);case 23:case"end":return e.stop()}}),e,null,[[13,20]])})));return function(t){return e.apply(this,arguments)}}()),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(2),console.log(e.t0);case 17:t.moreProposals&&t.getProposals(),t.loading=!1;case 19:case"end":return e.stop()}}),e,null,[[2,14]])})))()}}},d=o(25),component=Object(d.a)(c,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"has-text-centered"},[o("br"),t._v(" "),o("nuxt-link",{staticClass:"button is-secondary is-wide m-2",attrs:{to:"/proposals/new"}},[t._v("\n      New Proposal\n    ")]),t._v(" "),t.wallet&&t.wallet.auth?o("nuxt-link",{staticClass:"button is-secondary is-wide m-2 is-outlined",attrs:{to:"/account/"+t.wallet.auth.accountName}},[t._v("\n      Your Proposals\n    ")]):o("ConnectWallet",{attrs:{title:"Your Proposals","button-class":"is-wide is-outlined m-2"}})],1),t._v(" "),o("div",{staticClass:"box mt-5"},[o("h4",{staticClass:"subtitle box-title mb-0 is-4 has-text-weight-bold"},[t._v("\n      Proposals\n      "),o("div",{staticClass:"is-size-6 mt-2"},[o("small",[t.$dao.cycleConfig&&t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_voting_duration_sec,"seconds").isAfter()?o("span",[t.currentCycle?o("span",[t._v("Cycle "+t._s(t.currentCycle)+"\n              "),t.$dao.cycleConfig?o("span",[t._v("\n                started "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").fromNow())+" and ends "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_duration_sec,"seconds").fromNow())+" "),o("br"),t._v("\n                Voting ends "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_voting_duration_sec,"seconds").fromNow())+"\n              ")]):t._e()]):t._e()]):t.$dao.cycleConfig&&t.currentCycle?o("span",[t._v("\n            New cycle starts "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_duration_sec,"seconds").fromNow())+"\n          ")]):t.$dao.cycleConfig?o("span",[t._v("\n            Waiting for "),o("i",[t._v("Genesis Cycle")]),t._v(" "),t.$dao.cycleConfig?o("span",[t._v("start "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_duration_sec,"seconds").fromNow()))]):t._e()]):t._e()])])]),t._v(" "),o("div",{staticClass:"tabs"},[o("ul",t._l(t.statuses,(function(e){return o("li",{key:e.id,class:{"is-active":t.filter===e.id}},["Pending"!=e.name?o("a",{on:{click:function(o){o.preventDefault(),t.filter=e.id}}},[t._v(t._s(e.name))]):t._e()])})),0)]),t._v(" "),t.$dao.cycleConfig?[t.currentCycle?["ACTIVE"===t.filter?o("h5"):"PENDING"===t.filter?o("h5",[t._v("\n          Proposals for cycle "+t._s(t.currentCycle+1)+" starting "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_duration_sec,"seconds").fromNow())+"\n        ")]):t._e()]:["ACTIVE"===t.filter?o("h5",[t._v("\n          Waiting for "),o("i",[t._v("Genesis Cycle")]),t._v(" "+t._s(t.currentCycle+1)+" start "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_duration_sec,"seconds").fromNow())+"\n        ")]):t._e(),t._v(" "),"PENDING"===t.filter?o("h5",[t._v("\n          Proposals for "),o("i",[t._v("Genesis Cycle")]),t._v(" "+t._s(t.currentCycle+1)+" starting "+t._s(t.$moment(t.$dao.cycleConfig.start_time+"Z").add(t.$dao.proposalConfig.cycle_duration_sec,"seconds").fromNow())+"\n        ")]):t._e()]]:t._e(),t._v(" "),"DRAFT"===t.filter?o("h5",[t._v("\n      Not yet assigned to a cycle\n    ")]):"CLOSED"===t.filter?o("h5",[t._v("\n      Accepted or rejected proposals\n    ")]):t._e(),t._v(" "),t.proposals&&t.proposals.length>0?o("proposals",{attrs:{proposals:t.proposalsFiltered}}):t.proposals&&0==t.proposals.length?o("div",[t._v("\n      No proposals\n    ")]):t._e(),t._v(" "),t.loading?o("h4",{staticClass:"has-text-centered"},[t._v("\n      Loading proposals..\n    ")]):t._e()],2)])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{ConnectWallet:o(177).default,Proposals:o(695).default})}}]);