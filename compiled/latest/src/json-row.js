import{quoteLiteral as _}from"./sql-quoting";const a=50;function $(t,o){return l(t,o,T,N)}function s(t,o){return`json_array(${t.map(e=>T(o(e))).join(", ")})`}function H(t,o){return l(t,o,e=>e,j)}function l(t,o,e,i){if(t.length<=a)return`json_object(${t.flatMap(n=>[_(n),e(o(n))]).join(", ")})`;const p=t.map(n=>`json_quote(${_(n)}) || ':' || ${i(o(n))}`).flatMap((n,u)=>u===0?[n]:["','",n]);return`'{' || ${E(p)} || '}'`}function T(t){return`CASE typeof(${t})
    WHEN 'blob' THEN json_object('__edgepg_type','bytea','hex',hex(${t}))
    WHEN 'integer' THEN json_object('__edgepg_type','integer','value',CAST(${t} AS TEXT))
    WHEN 'real' THEN json_object('__edgepg_type','real','value',CAST(${t} AS TEXT))
    ELSE ${t} END`}function N(t){return`CASE typeof(${t})
    WHEN 'blob' THEN json_object('__edgepg_type','bytea','hex',hex(${t}))
    WHEN 'integer' THEN json_object('__edgepg_type','integer','value',CAST(${t} AS TEXT))
    WHEN 'real' THEN json_object('__edgepg_type','real','value',CAST(${t} AS TEXT))
    ELSE json_quote(${t}) END`}function j(t){return`CASE typeof(${t})
    WHEN 'null' THEN 'null'
    WHEN 'integer' THEN CAST(${t} AS TEXT)
    WHEN 'real' THEN CAST(${t} AS TEXT)
    ELSE json_quote(${t}) END`}function E(t){if(t.length===0)return"''";if(t.length===1)return t[0];const o=Math.floor(t.length/2);return`(${E(t.slice(0,o))} || ${E(t.slice(o))})`}export{H as plainJsonRow,s as typedJsonArray,$ as typedJsonRow};
