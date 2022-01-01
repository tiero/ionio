"use strict";(self.webpackChunkionio_website=self.webpackChunkionio_website||[]).push([[238],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return y}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),s=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=s(n),y=r,f=m["".concat(l,".").concat(y)]||m[y]||p[y]||o;return n?a.createElement(f,i(i({ref:t},u),{},{components:n})):a.createElement(f,i({ref:t},u))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var s=2;s<o;s++)i[s]=n[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3437:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return u},default:function(){return m}});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),i=["components"],c={},l="Ivy Syntax",s={unversionedId:"language/IvySyntax",id:"language/IvySyntax",title:"Ivy Syntax",description:"Ivy gives you essentially all the flexibility of Bitcoin Script, but gives you some additional affordances and conveniences:",source:"@site/docs/language/IvySyntax.md",sourceDirName:"language",slug:"/language/IvySyntax",permalink:"/docs/language/IvySyntax",editUrl:"https://github.com/ionio-lang/ionio/tree/main/website/docs/language/IvySyntax.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Functions",permalink:"/docs/language/Functions"},next:{title:"Types",permalink:"/docs/language/Types"}},u=[],p={toc:u};function m(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"ivy-syntax"},"Ivy Syntax"),(0,o.kt)("p",null,"Ivy gives you essentially all the flexibility of Bitcoin Script, but gives you some additional affordances and conveniences:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"named variables"),(0,o.kt)("li",{parentName:"ul"},'named "clauses"'),(0,o.kt)("li",{parentName:"ul"},"static (and domain-specific) ",(0,o.kt)("a",{parentName:"li",href:"/docs/language/Types"},"types")),(0,o.kt)("li",{parentName:"ul"},"familiar syntax for ",(0,o.kt)("a",{parentName:"li",href:"/docs/language/Functions"},"functions and operators"))),(0,o.kt)("p",null,"This is an example of an Ivy contract template:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"contract LockWithPublicKey(publicKey: PublicKey, val: Value) {\n  clause spend(sig: Signature) {\n    verify checkSig(publicKey, sig)\n    unlock val\n  }\n}\n")),(0,o.kt)("p",null,"Each contract template needs to be passed some ",(0,o.kt)("em",{parentName:"p"},"contract arguments")," to turn it into a contract. Each argument has a ",(0,o.kt)("a",{parentName:"p",href:"/docs/language/Types"},"type"),", such as PublicKey, Value, or Signature. "),(0,o.kt)("p",null,"This contract can be parameterized with a cryptographic public key, ",(0,o.kt)("strong",{parentName:"p"},"publicKey"),", to create an address."),(0,o.kt)("p",null,"You must also pass some ",(0,o.kt)("em",{parentName:"p"},"Value"),"\u2014the Bitcoins to be protected. Every contract template has such a parameter, in this case named ",(0,o.kt)("strong",{parentName:"p"},"val"),". To instantiate this contract on the Bitcoin mainnet, you would need to provide some amount of BTC\u2014actual value, not just data."),(0,o.kt)("p",null,"Each contract has one or more ",(0,o.kt)("em",{parentName:"p"},"clauses"),". To unlock the contract, you need to invoke one of its clauses, pass it one or more ",(0,o.kt)("em",{parentName:"p"},"clause arguments"),"\u2014in this case, a signature\u2014and satisfy each of its conditions."),(0,o.kt)("p",null,"In this case, the ",(0,o.kt)("strong",{parentName:"p"},"spend")," clause only enforces one condition. It uses the ",(0,o.kt)("em",{parentName:"p"},"checkSig")," ",(0,o.kt)("a",{parentName:"p",href:"/docs/language/Functions"},"function")," to enforce that ",(0,o.kt)("strong",{parentName:"p"},"sig")," must be a valid signature on the transaction by the private key corresponding to the prespecified ",(0,o.kt)("strong",{parentName:"p"},"publicKey"),"."),(0,o.kt)("p",null,"Finally, each clause needs to unlock the locked value, with a statement like ",(0,o.kt)("em",{parentName:"p"},"unlock val"),"."))}m.isMDXComponent=!0}}]);