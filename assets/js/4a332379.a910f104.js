"use strict";(self.webpackChunkionio_website=self.webpackChunkionio_website||[]).push([[631],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=s(n),f=a,y=m["".concat(l,".").concat(f)]||m[f]||c[f]||o;return n?r.createElement(y,p(p({ref:t},u),{},{components:n})):r.createElement(y,p({ref:t},u))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,p=new Array(o);p[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,p[1]=i;for(var s=2;s<o;s++)p[s]=n[s];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1430:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return u},default:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),p=["components"],i={},l="Types",s={unversionedId:"language/Types",id:"language/Types",title:"Types",description:"The following argument types are supported when compiling Ivy to Bitcoin Script:",source:"@site/docs/language/Types.md",sourceDirName:"language",slug:"/language/Types",permalink:"/docs/language/Types",editUrl:"https://github.com/ionio-lang/ionio/tree/main/website/docs/language/Types.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Ivy Syntax",permalink:"/docs/language/IvySyntax"},next:{title:"Ivy Playground for Bitcoin",permalink:"/docs/playground/"}},u=[],c={toc:u};function m(e){var t=e.components,n=(0,a.Z)(e,p);return(0,o.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"types"},"Types"),(0,o.kt)("p",null,"The following argument types are supported when compiling Ivy to Bitcoin Script:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Bytes"),": a string of bytes (typically represented in hexadecimal)")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"PublicKey"),": an ECDSA public key")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Signature"),": a ECDSA signature by some private key on the hash of the transaction")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Time"),": a time (either a block height or a timestamp)")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Duration"),": a duration (either a number of blocks or a multiple of 512 seconds)")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Boolean"),": either ",(0,o.kt)("strong",{parentName:"p"},"true")," or ",(0,o.kt)("strong",{parentName:"p"},"false"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Number"),": an integer between -2147483647 and 2147483647, inclusive.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Value"),": Some amount of Bitcoins (or, more precisely, some amount of satoshis). Parameters of type ",(0,o.kt)("em",{parentName:"p"},"Value")," represent actual Bitcoins that are locked up in a contract.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"HashableType"),": any type which can be passed to hash functions: ",(0,o.kt)("strong",{parentName:"p"},"Bytes"),", ",(0,o.kt)("strong",{parentName:"p"},"PublicKey"),", ",(0,o.kt)("strong",{parentName:"p"},"Sha256(T)"),", ",(0,o.kt)("strong",{parentName:"p"},"Sha1(T)"),", and ",(0,o.kt)("strong",{parentName:"p"},"Ripemd160(T)"),".")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Sha256(T: HashableType)"),": the result of taking a ",(0,o.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/SHA-2"},"SHA-256")," hash of a value of the hashable type T.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Sha1(T: HashableType)"),": the result of taking a ",(0,o.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/SHA-1"},"SHA-1")," hash of a value of the hashable type T.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Ripemd160(T: HashableType)"),": the result of taking a ",(0,o.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/RIPEMD"},"RIPEMD-160")," hash of a value of the hashable type T."))))}m.isMDXComponent=!0}}]);