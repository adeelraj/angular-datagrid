# Rendered
## Members
<dl>
<dt><a href="#partialsPath">partialsPath</a> : <code>String</code></dt>
<dd><p>the partials path. Useful to set where the directive should pick the view</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#$get">$get()</a> ⇒ <code>Object</code></dt>
<dd><p>$get main function while using the provider in an angular injected function</p>
</dd>
<dt><a href="#getDebugQuerystring">getDebugQuerystring()</a> ⇒ <code>String</code></dt>
<dd><p>returns debug querystring. A simple hack to avoid caching</p>
</dd>
<dt><a href="#getLocale">getLocale()</a> ⇒ <code>Object</code></dt>
<dd><p>returns localized object if present</p>
</dd>
<dt><a href="#debug">debug(debugmode)</a> ⇒ <code>Undefined</code></dt>
<dd><p>sets debugmode on/off</p>
</dd>
<dt><a href="#localeAdd">localeAdd(localeName, config)</a> ⇒ <code>Undefined</code></dt>
<dd><p>adds a localization object</p>
</dd>
<dt><a href="#setPartialsFolder">setPartialsFolder(folder)</a></dt>
<dd><p>sets the partialsPath parameter used by $get.partialsPath</p>
</dd>
</dl>
<a name="partialsPath"></a>
## partialsPath : <code>String</code>
the partials path. Useful to set where the directive should pick the view

**Kind**: global variable  
<a name="$get"></a>
## $get() ⇒ <code>Object</code>
$get main function while using the provider in an angular injected function

**Kind**: global function  
<a name="getDebugQuerystring"></a>
## getDebugQuerystring() ⇒ <code>String</code>
returns debug querystring. A simple hack to avoid caching

**Kind**: global function  
<a name="getLocale"></a>
## getLocale() ⇒ <code>Object</code>
returns localized object if present

**Kind**: global function  
<a name="debug"></a>
## debug(debugmode) ⇒ <code>Undefined</code>
sets debugmode on/off

**Kind**: global function  

| Param | Type |
| --- | --- |
| debugmode | <code>Boolean</code> | 

<a name="localeAdd"></a>
## localeAdd(localeName, config) ⇒ <code>Undefined</code>
adds a localization object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| localeName | <code>String</code> | the i18n locale name |
| config | <code>Object:string</code> | a set of keys: translations |

<a name="setPartialsFolder"></a>
## setPartialsFolder(folder)
sets the partialsPath parameter used by $get.partialsPath

**Kind**: global function  

| Param | Type |
| --- | --- |
| folder | <code>String</code> | 

