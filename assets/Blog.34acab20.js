import{f as y,g as C,z as L,A as I,q as r,B,D as M,E as T,k as w,h as a,F as e,G as m,H as d,I as N,J as b,K as P,L as S,M as A,n as D,p as O,N as j,O as F,P as H,Q as q,r as x}from"./app.3277ae91.js";import{S as z}from"./SkipLink.21455f1b.js";var E=y({name:"InfoList",setup(){const i=C(),t=L(),u=I(),p=r(()=>Object.keys(u.value.map).length),f=B(),v=M(),g=r(()=>Object.keys(v.value.map).length),o=T(),s=w("article"),n=r(()=>i.value.blogLocales),h=[["article",m],["category",d],["tag",b],["timeline",A]];return()=>a("div",{class:"blog-info-list"},[a("div",{class:"blog-type-wrapper"},h.map(([l,c])=>a("button",{class:"blog-type-button",onClick:()=>{s.value=l}},a("div",{class:["icon-wapper",{active:s.value===l}],"aria-label":n.value[l],"data-balloon-pos":"up"},a(c))))),s.value==="article"?a(e,()=>[a("div",{class:"sticky-article-wrapper"},[a("div",{class:"title",onClick:()=>o(t.value.path)},[a(m),a("span",{class:"num"},t.value.items.length),n.value.article]),a("hr"),a("ul",{class:"sticky-article-list"},f.value.items.map(({info:l,path:c},k)=>a(e,{appear:!0,delay:.08*(k+1)},()=>a("li",{class:"sticky-article",onClick:()=>o(c)},l.title))))])]):null,s.value==="category"?a(e,()=>[a("div",{class:"category-wrapper"},[p.value?a("div",{class:"title",onClick:()=>o(u.value.path)},[a(d),a("span",{class:"num"},p.value),n.value.category]):null,a("hr"),a(e,{delay:.04},()=>a(N))])]):null,s.value==="tag"?a(e,()=>[a("div",{class:"tag-wrapper"},[g.value?a("div",{class:"title",onClick:()=>o(v.value.path)},[a(b),a("span",{class:"num"},g.value),n.value.tag]):null,a("hr"),a(e,{delay:.04},()=>a(P))])]):null,s.value==="timeline"?a(e,()=>a(S)):null])}}),K=y({name:"Blog",setup(){const i=D(),t=O();return()=>[a(z),a(x("CommonWrapper"),{sidebar:!1},{default:()=>i.value.home?a(j):a("main",{class:"page blog",id:"main-content"},a("div",{class:"blog-page-wrapper"},[a(F),a(e,{delay:.16},()=>a(H))])),navScreenBottom:()=>a(q),...t.value?{sidebar:()=>a(E)}:{}})]}});export{K as default};
