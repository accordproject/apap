---
title: Accord Protocol v1.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="accord-protocol">Accord Protocol v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API for document generation and agreement automation

Base URLs:

<h1 id="accord-protocol-sharedmodels">sharedmodels</h1>

## listSharedmodels

<a id="opIdlistSharedmodels"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /sharedmodels \
  -H 'Accept: application/json'

```

```http
GET /sharedmodels HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/sharedmodels',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/sharedmodels',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/sharedmodels', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/sharedmodels', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/sharedmodels");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/sharedmodels", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /sharedmodels`

*List All Sharedmodels*

Gets a list of all `sharedmodel` entities.

> Example responses

> 200 Response

```json
[
  {
    "$class": "org.accordproject.protocol@1.0.0.SharedModel",
    "uri": "string",
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.DomainModel"
    }
  }
]
```

<h3 id="listsharedmodels-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns an array of `sharedmodel` entities.|Inline|

<h3 id="listsharedmodels-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[org.accordproject.protocol@1.0.0.SharedModel](#schemaorg.accordproject.protocol@1.0.0.sharedmodel)]|false|none|[An instance of org.accordproject.protocol@1.0.0.SharedModel]|
|» SharedModel|[org.accordproject.protocol@1.0.0.SharedModel](#schemaorg.accordproject.protocol@1.0.0.sharedmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.SharedModel|
|»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.SharedModel|
|»» uri|string|true|none|The instance identifier for this type|
|»» model|any|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|[org.accordproject.protocol@1.0.0.DomainModel](#schemaorg.accordproject.protocol@1.0.0.domainmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.DomainModel|
|»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.DomainModel|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|[org.accordproject.protocol@1.0.0.CtoModel](#schemaorg.accordproject.protocol@1.0.0.ctomodel)|false|none|An instance of org.accordproject.protocol@1.0.0.CtoModel|
|»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.CtoModel|
|»»»» ctoFiles|[[org.accordproject.protocol@1.0.0.CtoFile](#schemaorg.accordproject.protocol@1.0.0.ctofile)]|true|none|[An instance of org.accordproject.protocol@1.0.0.CtoFile]|
|»»»»» CtoFile|[org.accordproject.protocol@1.0.0.CtoFile](#schemaorg.accordproject.protocol@1.0.0.ctofile)|false|none|An instance of org.accordproject.protocol@1.0.0.CtoFile|
|»»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.CtoFile|
|»»»»»» contents|string|true|none|none|
|»»»»»» filename|string|true|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|[org.accordproject.protocol@1.0.0.JsonModel](#schemaorg.accordproject.protocol@1.0.0.jsonmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.JsonModel|
|»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.JsonModel|
|»»»» model|[concerto.metamodel@0.4.0.Model](#schemaconcerto.metamodel@0.4.0.model)|false|none|An instance of concerto.metamodel@0.4.0.Model|
|»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Model|
|»»»»» namespace|string|true|none|none|
|»»»»» sourceUri|string|false|none|none|
|»»»»» concertoVersion|string|false|none|none|
|»»»»» imports|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Import](#schemaconcerto.metamodel@0.4.0.import)|false|none|An instance of concerto.metamodel@0.4.0.Import|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Import|
|»»»»»»» namespace|string|true|none|none|
|»»»»»»» uri|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ImportAll](#schemaconcerto.metamodel@0.4.0.importall)|false|none|An instance of concerto.metamodel@0.4.0.ImportAll|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ImportAll|
|»»»»»»» namespace|string|true|none|none|
|»»»»»»» uri|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ImportType](#schemaconcerto.metamodel@0.4.0.importtype)|false|none|An instance of concerto.metamodel@0.4.0.ImportType|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ImportType|
|»»»»»»» name|string|true|none|none|
|»»»»»»» namespace|string|true|none|none|
|»»»»»»» uri|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» declarations|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Declaration](#schemaconcerto.metamodel@0.4.0.declaration)|false|none|An instance of concerto.metamodel@0.4.0.Declaration|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Declaration|
|»»»»»»» name|string|true|none|none|
|»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» arguments|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorLiteral](#schemaconcerto.metamodel@0.4.0.decoratorliteral)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorLiteral|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorLiteral|
|»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Range|
|»»»»»»»»»»»» start|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»»»» line|integer|true|none|none|
|»»»»»»»»»»»»» column|integer|true|none|none|
|»»»»»»»»»»»»» offset|integer|true|none|none|
|»»»»»»»»»»»» end|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»»» source|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorString](#schemaconcerto.metamodel@0.4.0.decoratorstring)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorString|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorString|
|»»»»»»»»»»» value|string|true|none|none|
|»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorNumber](#schemaconcerto.metamodel@0.4.0.decoratornumber)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorNumber|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorNumber|
|»»»»»»»»»»» value|number|true|none|none|
|»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorBoolean](#schemaconcerto.metamodel@0.4.0.decoratorboolean)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorBoolean|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorBoolean|
|»»»»»»»»»»» value|boolean|true|none|none|
|»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorTypeReference](#schemaconcerto.metamodel@0.4.0.decoratortypereference)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorTypeReference|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorTypeReference|
|»»»»»»»»»»» type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»»»» namespace|string|false|none|none|
|»»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.EnumDeclaration](#schemaconcerto.metamodel@0.4.0.enumdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.EnumDeclaration|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EnumDeclaration|
|»»»»»»» properties|[[concerto.metamodel@0.4.0.EnumProperty](#schemaconcerto.metamodel@0.4.0.enumproperty)]|true|none|[An instance of concerto.metamodel@0.4.0.EnumProperty]|
|»»»»»»»» EnumProperty|[concerto.metamodel@0.4.0.EnumProperty](#schemaconcerto.metamodel@0.4.0.enumproperty)|false|none|An instance of concerto.metamodel@0.4.0.EnumProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EnumProperty|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»»» name|string|true|none|none|
|»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ConceptDeclaration](#schemaconcerto.metamodel@0.4.0.conceptdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.ConceptDeclaration|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ConceptDeclaration|
|»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IdentifiedBy|
|»»»»»»»»» name|string|true|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Property|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.RelationshipProperty|
|»»»»»»»»» type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ObjectProperty|
|»»»»»»»»» defaultValue|string|false|none|none|
|»»»»»»»»» type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.BooleanProperty|
|»»»»»»»»» defaultValue|boolean|false|none|none|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DateTimeProperty|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.StringProperty|
|»»»»»»»»» defaultValue|string|false|none|none|
|»»»»»»»»» validator|[concerto.metamodel@0.4.0.StringRegexValidator](#schemaconcerto.metamodel@0.4.0.stringregexvalidator)|false|none|An instance of concerto.metamodel@0.4.0.StringRegexValidator|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.StringRegexValidator|
|»»»»»»»»»» pattern|string|true|none|none|
|»»»»»»»»»» flags|string|true|none|none|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DoubleProperty|
|»»»»»»»»» defaultValue|number|false|none|none|
|»»»»»»»»» validator|[concerto.metamodel@0.4.0.DoubleDomainValidator](#schemaconcerto.metamodel@0.4.0.doubledomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.DoubleDomainValidator|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DoubleDomainValidator|
|»»»»»»»»»» lower|number|false|none|none|
|»»»»»»»»»» upper|number|false|none|none|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IntegerProperty|
|»»»»»»»»» defaultValue|integer|false|none|none|
|»»»»»»»»» validator|[concerto.metamodel@0.4.0.IntegerDomainValidator](#schemaconcerto.metamodel@0.4.0.integerdomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.IntegerDomainValidator|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IntegerDomainValidator|
|»»»»»»»»»» lower|integer|false|none|none|
|»»»»»»»»»» upper|integer|false|none|none|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|
|»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.LongProperty|
|»»»»»»»»» defaultValue|integer|false|none|none|
|»»»»»»»»» validator|[concerto.metamodel@0.4.0.LongDomainValidator](#schemaconcerto.metamodel@0.4.0.longdomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.LongDomainValidator|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.LongDomainValidator|
|»»»»»»»»»» lower|integer|false|none|none|
|»»»»»»»»»» upper|integer|false|none|none|
|»»»»»»»»» name|string|true|none|none|
|»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» name|string|true|none|none|
|»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.AssetDeclaration](#schemaconcerto.metamodel@0.4.0.assetdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.AssetDeclaration|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.AssetDeclaration|
|»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» name|string|true|none|none|
|»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ParticipantDeclaration](#schemaconcerto.metamodel@0.4.0.participantdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.ParticipantDeclaration|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ParticipantDeclaration|
|»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» name|string|true|none|none|
|»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.TransactionDeclaration](#schemaconcerto.metamodel@0.4.0.transactiondeclaration)|false|none|An instance of concerto.metamodel@0.4.0.TransactionDeclaration|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.TransactionDeclaration|
|»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» name|string|true|none|none|
|»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|[concerto.metamodel@0.4.0.EventDeclaration](#schemaconcerto.metamodel@0.4.0.eventdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.EventDeclaration|
|»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EventDeclaration|
|»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» name|string|true|none|none|
|»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<aside class="success">
This operation does not require authentication
</aside>

## createSharedmodel

<a id="opIdcreateSharedmodel"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /sharedmodels \
  -H 'Content-Type: application/json'

```

```http
POST /sharedmodels HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.SharedModel",
  "uri": "string",
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.DomainModel"
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/sharedmodels',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post '/sharedmodels',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/sharedmodels', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/sharedmodels', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/sharedmodels");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/sharedmodels", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /sharedmodels`

*Create a Sharedmodel*

Creates a new instance of a `sharedmodel`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.SharedModel",
  "uri": "string",
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.DomainModel"
  }
}
```

<h3 id="createsharedmodel-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.SharedModel](#schemaorg.accordproject.protocol@1.0.0.sharedmodel)|true|A new `sharedmodel` to be created.|

<h3 id="createsharedmodel-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## getSharedmodel

<a id="opIdgetSharedmodel"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /sharedmodels/{uri} \
  -H 'Accept: application/json'

```

```http
GET /sharedmodels/{uri} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/sharedmodels/{uri}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/sharedmodels/{uri}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/sharedmodels/{uri}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/sharedmodels/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/sharedmodels/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/sharedmodels/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /sharedmodels/{uri}`

*Get a sharedmodel*

Gets the details of a single instance of a `sharedmodel`.

<h3 id="getsharedmodel-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|uri|path|string|true|A unique identifier for a `SharedModel`.|

> Example responses

> 200 Response

```json
{
  "$class": "org.accordproject.protocol@1.0.0.SharedModel",
  "uri": "string",
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.DomainModel"
  }
}
```

<h3 id="getsharedmodel-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns a single `sharedmodel`.|[org.accordproject.protocol@1.0.0.SharedModel](#schemaorg.accordproject.protocol@1.0.0.sharedmodel)|

<aside class="success">
This operation does not require authentication
</aside>

## replaceSharedmodel

<a id="opIdreplaceSharedmodel"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT /sharedmodels/{uri} \
  -H 'Content-Type: application/json'

```

```http
PUT /sharedmodels/{uri} HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.SharedModel",
  "uri": "string",
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.DomainModel"
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/sharedmodels/{uri}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put '/sharedmodels/{uri}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('/sharedmodels/{uri}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','/sharedmodels/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/sharedmodels/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "/sharedmodels/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /sharedmodels/{uri}`

*Update a sharedmodel*

Updates an existing `sharedmodel`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.SharedModel",
  "uri": "string",
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.DomainModel"
  }
}
```

<h3 id="replacesharedmodel-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.SharedModel](#schemaorg.accordproject.protocol@1.0.0.sharedmodel)|true|Updated `sharedmodel` information.|
|uri|path|string|true|A unique identifier for a `SharedModel`.|

<h3 id="replacesharedmodel-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## deleteSharedmodel

<a id="opIddeleteSharedmodel"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /sharedmodels/{uri}

```

```http
DELETE /sharedmodels/{uri} HTTP/1.1

```

```javascript

fetch('/sharedmodels/{uri}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete '/sharedmodels/{uri}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('/sharedmodels/{uri}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/sharedmodels/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/sharedmodels/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/sharedmodels/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /sharedmodels/{uri}`

*Delete a sharedmodel*

Deletes an existing `sharedmodel`.

<h3 id="deletesharedmodel-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|uri|path|string|true|A unique identifier for a `SharedModel`.|

<h3 id="deletesharedmodel-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="accord-protocol-templates">templates</h1>

## listTemplates

<a id="opIdlistTemplates"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /templates \
  -H 'Accept: application/json'

```

```http
GET /templates HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/templates',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/templates',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/templates', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/templates', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/templates");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/templates", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /templates`

*List All Templates*

Gets a list of all `template` entities.

> Example responses

> 200 Response

```json
[
  {
    "$class": "org.accordproject.protocol@1.0.0.Template",
    "uri": "string",
    "author": "string",
    "displayName": "string",
    "version": "string",
    "description": "string",
    "license": "string",
    "keywords": [
      "string"
    ],
    "metadata": {
      "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
      "runtime": "string",
      "template": "string",
      "cicero": "string"
    },
    "logo": {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    },
    "templateModel": {
      "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
      "typeName": "string",
      "sharedModel": "string",
      "model": {
        "$class": "org.accordproject.protocol@1.0.0.DomainModel"
      }
    },
    "text": {
      "$class": "org.accordproject.protocol@1.0.0.Text",
      "templateMark": {
        "$class": "org.accordproject.commonmark@0.5.0.Document",
        "xmlns": "string",
        "text": "string",
        "nodes": [
          {
            "$class": "org.accordproject.commonmark@0.5.0.Node",
            "text": "string",
            "nodes": [
              {
                "$class": "org.accordproject.commonmark@0.5.0.Node",
                "text": "string",
                "nodes": [],
                "startLine": 0,
                "endLine": 0
              }
            ],
            "startLine": 0,
            "endLine": 0
          }
        ],
        "startLine": 0,
        "endLine": 0
      },
      "templateText": "string"
    },
    "logic": {
      "$class": "org.accordproject.protocol@1.0.0.Logic",
      "stateType": "string",
      "codes": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Code",
          "id": "string",
          "type": "ES2015",
          "encoding": "PLAIN_TEXT",
          "value": "string"
        }
      ]
    },
    "sampleRequest": "string"
  }
]
```

<h3 id="listtemplates-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns an array of `template` entities.|Inline|

<h3 id="listtemplates-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[org.accordproject.protocol@1.0.0.Template](#schemaorg.accordproject.protocol@1.0.0.template)]|false|none|[An instance of org.accordproject.protocol@1.0.0.Template]|
|» Template|[org.accordproject.protocol@1.0.0.Template](#schemaorg.accordproject.protocol@1.0.0.template)|false|none|An instance of org.accordproject.protocol@1.0.0.Template|
|»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Template|
|»» uri|string|true|none|The instance identifier for this type|
|»» author|string|true|none|none|
|»» displayName|string|false|none|none|
|»» version|string|true|none|none|
|»» description|string|false|none|none|
|»» license|string|true|none|none|
|»» keywords|[string]|false|none|none|
|»» metadata|[org.accordproject.protocol@1.0.0.TemplateMetadata](#schemaorg.accordproject.protocol@1.0.0.templatemetadata)|true|none|An instance of org.accordproject.protocol@1.0.0.TemplateMetadata|
|»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.TemplateMetadata|
|»»» runtime|string|true|none|none|
|»»» template|string|true|none|none|
|»»» cicero|string|true|none|none|
|»» logo|[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)|false|none|An instance of org.accordproject.protocol@1.0.0.Blob|
|»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Blob|
|»»» base64|string|true|none|none|
|»»» mimeType|string|true|none|none|
|»» templateModel|[org.accordproject.protocol@1.0.0.TemplateModel](#schemaorg.accordproject.protocol@1.0.0.templatemodel)|true|none|An instance of org.accordproject.protocol@1.0.0.TemplateModel|
|»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.TemplateModel|
|»»» typeName|string|true|none|none|
|»»» sharedModel|string|false|none|The identifier of an instance of org.accordproject.protocol@1.0.0.SharedModel|
|»»» model|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|[org.accordproject.protocol@1.0.0.DomainModel](#schemaorg.accordproject.protocol@1.0.0.domainmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.DomainModel|
|»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.DomainModel|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|[org.accordproject.protocol@1.0.0.CtoModel](#schemaorg.accordproject.protocol@1.0.0.ctomodel)|false|none|An instance of org.accordproject.protocol@1.0.0.CtoModel|
|»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.CtoModel|
|»»»»» ctoFiles|[[org.accordproject.protocol@1.0.0.CtoFile](#schemaorg.accordproject.protocol@1.0.0.ctofile)]|true|none|[An instance of org.accordproject.protocol@1.0.0.CtoFile]|
|»»»»»» CtoFile|[org.accordproject.protocol@1.0.0.CtoFile](#schemaorg.accordproject.protocol@1.0.0.ctofile)|false|none|An instance of org.accordproject.protocol@1.0.0.CtoFile|
|»»»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.CtoFile|
|»»»»»»» contents|string|true|none|none|
|»»»»»»» filename|string|true|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|[org.accordproject.protocol@1.0.0.JsonModel](#schemaorg.accordproject.protocol@1.0.0.jsonmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.JsonModel|
|»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.JsonModel|
|»»»»» model|[concerto.metamodel@0.4.0.Model](#schemaconcerto.metamodel@0.4.0.model)|false|none|An instance of concerto.metamodel@0.4.0.Model|
|»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Model|
|»»»»»» namespace|string|true|none|none|
|»»»»»» sourceUri|string|false|none|none|
|»»»»»» concertoVersion|string|false|none|none|
|»»»»»» imports|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Import](#schemaconcerto.metamodel@0.4.0.import)|false|none|An instance of concerto.metamodel@0.4.0.Import|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Import|
|»»»»»»»» namespace|string|true|none|none|
|»»»»»»»» uri|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ImportAll](#schemaconcerto.metamodel@0.4.0.importall)|false|none|An instance of concerto.metamodel@0.4.0.ImportAll|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ImportAll|
|»»»»»»»» namespace|string|true|none|none|
|»»»»»»»» uri|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ImportType](#schemaconcerto.metamodel@0.4.0.importtype)|false|none|An instance of concerto.metamodel@0.4.0.ImportType|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ImportType|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» namespace|string|true|none|none|
|»»»»»»»» uri|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» declarations|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Declaration](#schemaconcerto.metamodel@0.4.0.declaration)|false|none|An instance of concerto.metamodel@0.4.0.Declaration|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Declaration|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» arguments|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorLiteral](#schemaconcerto.metamodel@0.4.0.decoratorliteral)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorLiteral|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorLiteral|
|»»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Range|
|»»»»»»»»»»»»» start|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»»»»» line|integer|true|none|none|
|»»»»»»»»»»»»»» column|integer|true|none|none|
|»»»»»»»»»»»»»» offset|integer|true|none|none|
|»»»»»»»»»»»»» end|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»»»» source|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorString](#schemaconcerto.metamodel@0.4.0.decoratorstring)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorString|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorString|
|»»»»»»»»»»»» value|string|true|none|none|
|»»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorNumber](#schemaconcerto.metamodel@0.4.0.decoratornumber)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorNumber|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorNumber|
|»»»»»»»»»»»» value|number|true|none|none|
|»»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorBoolean](#schemaconcerto.metamodel@0.4.0.decoratorboolean)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorBoolean|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorBoolean|
|»»»»»»»»»»»» value|boolean|true|none|none|
|»»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DecoratorTypeReference](#schemaconcerto.metamodel@0.4.0.decoratortypereference)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorTypeReference|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorTypeReference|
|»»»»»»»»»»»» type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»»»»» namespace|string|false|none|none|
|»»»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.EnumDeclaration](#schemaconcerto.metamodel@0.4.0.enumdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.EnumDeclaration|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EnumDeclaration|
|»»»»»»»» properties|[[concerto.metamodel@0.4.0.EnumProperty](#schemaconcerto.metamodel@0.4.0.enumproperty)]|true|none|[An instance of concerto.metamodel@0.4.0.EnumProperty]|
|»»»»»»»»» EnumProperty|[concerto.metamodel@0.4.0.EnumProperty](#schemaconcerto.metamodel@0.4.0.enumproperty)|false|none|An instance of concerto.metamodel@0.4.0.EnumProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EnumProperty|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ConceptDeclaration](#schemaconcerto.metamodel@0.4.0.conceptdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.ConceptDeclaration|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ConceptDeclaration|
|»»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IdentifiedBy|
|»»»»»»»»»» name|string|true|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Property|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.RelationshipProperty|
|»»»»»»»»»» type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ObjectProperty|
|»»»»»»»»»» defaultValue|string|false|none|none|
|»»»»»»»»»» type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.BooleanProperty|
|»»»»»»»»»» defaultValue|boolean|false|none|none|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DateTimeProperty|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.StringProperty|
|»»»»»»»»»» defaultValue|string|false|none|none|
|»»»»»»»»»» validator|[concerto.metamodel@0.4.0.StringRegexValidator](#schemaconcerto.metamodel@0.4.0.stringregexvalidator)|false|none|An instance of concerto.metamodel@0.4.0.StringRegexValidator|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.StringRegexValidator|
|»»»»»»»»»»» pattern|string|true|none|none|
|»»»»»»»»»»» flags|string|true|none|none|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DoubleProperty|
|»»»»»»»»»» defaultValue|number|false|none|none|
|»»»»»»»»»» validator|[concerto.metamodel@0.4.0.DoubleDomainValidator](#schemaconcerto.metamodel@0.4.0.doubledomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.DoubleDomainValidator|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DoubleDomainValidator|
|»»»»»»»»»»» lower|number|false|none|none|
|»»»»»»»»»»» upper|number|false|none|none|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IntegerProperty|
|»»»»»»»»»» defaultValue|integer|false|none|none|
|»»»»»»»»»» validator|[concerto.metamodel@0.4.0.IntegerDomainValidator](#schemaconcerto.metamodel@0.4.0.integerdomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.IntegerDomainValidator|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IntegerDomainValidator|
|»»»»»»»»»»» lower|integer|false|none|none|
|»»»»»»»»»»» upper|integer|false|none|none|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|
|»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.LongProperty|
|»»»»»»»»»» defaultValue|integer|false|none|none|
|»»»»»»»»»» validator|[concerto.metamodel@0.4.0.LongDomainValidator](#schemaconcerto.metamodel@0.4.0.longdomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.LongDomainValidator|
|»»»»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.LongDomainValidator|
|»»»»»»»»»»» lower|integer|false|none|none|
|»»»»»»»»»»» upper|integer|false|none|none|
|»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»» isArray|boolean|true|none|none|
|»»»»»»»»»» isOptional|boolean|true|none|none|
|»»»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.AssetDeclaration](#schemaconcerto.metamodel@0.4.0.assetdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.AssetDeclaration|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.AssetDeclaration|
|»»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ParticipantDeclaration](#schemaconcerto.metamodel@0.4.0.participantdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.ParticipantDeclaration|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ParticipantDeclaration|
|»»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.TransactionDeclaration](#schemaconcerto.metamodel@0.4.0.transactiondeclaration)|false|none|An instance of concerto.metamodel@0.4.0.TransactionDeclaration|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.TransactionDeclaration|
|»»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.EventDeclaration](#schemaconcerto.metamodel@0.4.0.eventdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.EventDeclaration|
|»»»»»»»» $class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EventDeclaration|
|»»»»»»»» isAbstract|boolean|true|none|none|
|»»»»»»»» identified|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»»»»» properties|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»» text|[org.accordproject.protocol@1.0.0.Text](#schemaorg.accordproject.protocol@1.0.0.text)|true|none|An instance of org.accordproject.protocol@1.0.0.Text|
|»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Text|
|»»» templateMark|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|
|»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Document|
|»»»» xmlns|string|true|none|none|
|»»»» text|string|false|none|none|
|»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|
|»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Node|
|»»»»»» text|string|false|none|none|
|»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|
|»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Root|
|»»»»»»»» text|string|false|none|none|
|»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|
|»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Child|
|»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Text|
|»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|
|»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.CodeBlock|
|»»»»»»»»»»»»»» info|string|false|none|none|
|»»»»»»»»»»»»»» tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TagInfo|
|»»»»»»»»»»»»»»» tagName|string|true|none|none|
|»»»»»»»»»»»»»»» attributeString|string|true|none|none|
|»»»»»»»»»»»»»»» attributes|[[org.accordproject.commonmark@0.5.0.Attribute](#schemaorg.accordproject.commonmark@0.5.0.attribute)]|true|none|[An instance of org.accordproject.commonmark@0.5.0.Attribute]|
|»»»»»»»»»»»»»»»» Attribute|[org.accordproject.commonmark@0.5.0.Attribute](#schemaorg.accordproject.commonmark@0.5.0.attribute)|false|none|An instance of org.accordproject.commonmark@0.5.0.Attribute|
|»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Attribute|
|»»»»»»»»»»»»»»»»» name|string|true|none|none|
|»»»»»»»»»»»»»»»»» value|string|true|none|none|
|»»»»»»»»»»»»»»» content|string|true|none|none|
|»»»»»»»»»»»»»»» closed|boolean|true|none|none|
|»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|
|»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Code|
|»»»»»»»»»»»»»»»» info|string|false|none|none|
|»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|
|»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.HtmlInline|
|»»»»»»»»»»»»»»»»»» tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|
|»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.HtmlBlock|
|»»»»»»»»»»»»»»»»»»»» tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|
|»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Emph|
|»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|
|»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Strong|
|»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|
|»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.BlockQuote|
|»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Heading|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»» level|string|true|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.ThematicBreak|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Softbreak|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Linebreak|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Link|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» destination|string|true|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» title|string|true|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Image|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» destination|string|true|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» title|string|true|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Paragraph|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.List|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» type|string|true|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» start|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» tight|string|true|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» delimiter|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Item|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Table|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableHead|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableBody|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableRow|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.HeaderCell|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» $class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableCell|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» text|string|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» nodes|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»»» startLine|integer|false|none|none|
|»»»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» startLine|integer|false|none|none|
|»»»»»» endLine|integer|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|any|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» startLine|integer|false|none|none|
|»»»» endLine|integer|false|none|none|
|»»» templateText|string|false|none|none|
|»» logic|[org.accordproject.protocol@1.0.0.Logic](#schemaorg.accordproject.protocol@1.0.0.logic)|false|none|An instance of org.accordproject.protocol@1.0.0.Logic|
|»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Logic|
|»»» stateType|string|false|none|none|
|»»» codes|[[org.accordproject.protocol@1.0.0.Code](#schemaorg.accordproject.protocol@1.0.0.code)]|true|none|[An instance of org.accordproject.protocol@1.0.0.Code]|
|»»»» Code|[org.accordproject.protocol@1.0.0.Code](#schemaorg.accordproject.protocol@1.0.0.code)|false|none|An instance of org.accordproject.protocol@1.0.0.Code|
|»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Code|
|»»»»» id|string|true|none|The instance identifier for this type|
|»»»»» type|any|true|none|An instance of org.accordproject.protocol@1.0.0.CodeType|
|»»»»» encoding|any|true|none|An instance of org.accordproject.protocol@1.0.0.CodeEncodingType|
|»»»»» value|string|true|none|none|
|»» sampleRequest|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|ES2015|
|type|WASM_BYTES|
|type|TYPESCRIPT|
|encoding|PLAIN_TEXT|
|encoding|BASE64|

<aside class="success">
This operation does not require authentication
</aside>

## createTemplate

<a id="opIdcreateTemplate"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /templates \
  -H 'Content-Type: application/json'

```

```http
POST /templates HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "uri": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
    "runtime": "string",
    "template": "string",
    "cicero": "string"
  },
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Blob",
    "base64": "string",
    "mimeType": "string"
  },
  "templateModel": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
    "typeName": "string",
    "sharedModel": "string",
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.DomainModel"
    }
  },
  "text": {
    "$class": "org.accordproject.protocol@1.0.0.Text",
    "templateMark": {
      "$class": "org.accordproject.commonmark@0.5.0.Document",
      "xmlns": "string",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark@0.5.0.Node",
              "text": "string",
              "nodes": [],
              "startLine": 0,
              "endLine": 0
            }
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    },
    "templateText": "string"
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "stateType": "string",
    "codes": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Code",
        "id": "string",
        "type": "ES2015",
        "encoding": "PLAIN_TEXT",
        "value": "string"
      }
    ]
  },
  "sampleRequest": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/templates',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post '/templates',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/templates', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/templates', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/templates");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/templates", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /templates`

*Create a Template*

Creates a new instance of a `template`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "uri": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
    "runtime": "string",
    "template": "string",
    "cicero": "string"
  },
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Blob",
    "base64": "string",
    "mimeType": "string"
  },
  "templateModel": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
    "typeName": "string",
    "sharedModel": "string",
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.DomainModel"
    }
  },
  "text": {
    "$class": "org.accordproject.protocol@1.0.0.Text",
    "templateMark": {
      "$class": "org.accordproject.commonmark@0.5.0.Document",
      "xmlns": "string",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark@0.5.0.Node",
              "text": "string",
              "nodes": [],
              "startLine": 0,
              "endLine": 0
            }
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    },
    "templateText": "string"
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "stateType": "string",
    "codes": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Code",
        "id": "string",
        "type": "ES2015",
        "encoding": "PLAIN_TEXT",
        "value": "string"
      }
    ]
  },
  "sampleRequest": "string"
}
```

<h3 id="createtemplate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.Template](#schemaorg.accordproject.protocol@1.0.0.template)|true|A new `template` to be created.|

<h3 id="createtemplate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## getTemplate

<a id="opIdgetTemplate"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /templates/{uri} \
  -H 'Accept: application/json'

```

```http
GET /templates/{uri} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/templates/{uri}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/templates/{uri}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/templates/{uri}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/templates/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/templates/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/templates/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /templates/{uri}`

*Get a template*

Gets the details of a single instance of a `template`.

<h3 id="gettemplate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|uri|path|string|true|A unique identifier for a `Template`.|

> Example responses

> 200 Response

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "uri": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
    "runtime": "string",
    "template": "string",
    "cicero": "string"
  },
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Blob",
    "base64": "string",
    "mimeType": "string"
  },
  "templateModel": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
    "typeName": "string",
    "sharedModel": "string",
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.DomainModel"
    }
  },
  "text": {
    "$class": "org.accordproject.protocol@1.0.0.Text",
    "templateMark": {
      "$class": "org.accordproject.commonmark@0.5.0.Document",
      "xmlns": "string",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark@0.5.0.Node",
              "text": "string",
              "nodes": [],
              "startLine": 0,
              "endLine": 0
            }
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    },
    "templateText": "string"
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "stateType": "string",
    "codes": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Code",
        "id": "string",
        "type": "ES2015",
        "encoding": "PLAIN_TEXT",
        "value": "string"
      }
    ]
  },
  "sampleRequest": "string"
}
```

<h3 id="gettemplate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns a single `template`.|[org.accordproject.protocol@1.0.0.Template](#schemaorg.accordproject.protocol@1.0.0.template)|

<aside class="success">
This operation does not require authentication
</aside>

## replaceTemplate

<a id="opIdreplaceTemplate"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT /templates/{uri} \
  -H 'Content-Type: application/json'

```

```http
PUT /templates/{uri} HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "uri": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
    "runtime": "string",
    "template": "string",
    "cicero": "string"
  },
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Blob",
    "base64": "string",
    "mimeType": "string"
  },
  "templateModel": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
    "typeName": "string",
    "sharedModel": "string",
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.DomainModel"
    }
  },
  "text": {
    "$class": "org.accordproject.protocol@1.0.0.Text",
    "templateMark": {
      "$class": "org.accordproject.commonmark@0.5.0.Document",
      "xmlns": "string",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark@0.5.0.Node",
              "text": "string",
              "nodes": [],
              "startLine": 0,
              "endLine": 0
            }
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    },
    "templateText": "string"
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "stateType": "string",
    "codes": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Code",
        "id": "string",
        "type": "ES2015",
        "encoding": "PLAIN_TEXT",
        "value": "string"
      }
    ]
  },
  "sampleRequest": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/templates/{uri}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put '/templates/{uri}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('/templates/{uri}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','/templates/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/templates/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "/templates/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /templates/{uri}`

*Update a template*

Updates an existing `template`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "uri": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
    "runtime": "string",
    "template": "string",
    "cicero": "string"
  },
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Blob",
    "base64": "string",
    "mimeType": "string"
  },
  "templateModel": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
    "typeName": "string",
    "sharedModel": "string",
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.DomainModel"
    }
  },
  "text": {
    "$class": "org.accordproject.protocol@1.0.0.Text",
    "templateMark": {
      "$class": "org.accordproject.commonmark@0.5.0.Document",
      "xmlns": "string",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark@0.5.0.Node",
              "text": "string",
              "nodes": [],
              "startLine": 0,
              "endLine": 0
            }
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    },
    "templateText": "string"
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "stateType": "string",
    "codes": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Code",
        "id": "string",
        "type": "ES2015",
        "encoding": "PLAIN_TEXT",
        "value": "string"
      }
    ]
  },
  "sampleRequest": "string"
}
```

<h3 id="replacetemplate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.Template](#schemaorg.accordproject.protocol@1.0.0.template)|true|Updated `template` information.|
|uri|path|string|true|A unique identifier for a `Template`.|

<h3 id="replacetemplate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## deleteTemplate

<a id="opIddeleteTemplate"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /templates/{uri}

```

```http
DELETE /templates/{uri} HTTP/1.1

```

```javascript

fetch('/templates/{uri}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete '/templates/{uri}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('/templates/{uri}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/templates/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/templates/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/templates/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /templates/{uri}`

*Delete a template*

Deletes an existing `template`.

<h3 id="deletetemplate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|uri|path|string|true|A unique identifier for a `Template`.|

<h3 id="deletetemplate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="accord-protocol-agreements">agreements</h1>

## listAgreements

<a id="opIdlistAgreements"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /agreements \
  -H 'Accept: application/json'

```

```http
GET /agreements HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/agreements',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/agreements',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/agreements', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/agreements', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/agreements");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/agreements", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /agreements`

*List All Agreements*

Gets a list of all `agreement` entities.

> Example responses

> 200 Response

```json
[
  {
    "$class": "org.accordproject.protocol@1.0.0.Agreement",
    "uri": "string",
    "data": "string",
    "template": "string",
    "state": "string",
    "agreementStatus": "DRAFT",
    "agreementParties": [
      {
        "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
        "name": "string",
        "signatory": true,
        "role": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "network": "string",
        "address": {
          "$class": "org.accordproject.protocol@1.0.0.Address",
          "streetRoad": [
            "string"
          ],
          "suburbTownCity": "string",
          "stateTerritoryRegion": "string",
          "postalCode": "string",
          "country": "string"
        },
        "partyId": "string"
      }
    ],
    "signatures": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Signature",
        "signatory": {
          "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
          "name": "string",
          "signatory": true,
          "role": "string",
          "email": "string",
          "phone": "string",
          "company": "string",
          "network": "string",
          "address": {
            "$class": "org.accordproject.protocol@1.0.0.Address",
            "streetRoad": [
              "string"
            ],
            "suburbTownCity": "string",
            "stateTerritoryRegion": "string",
            "postalCode": "string",
            "country": "string"
          },
          "partyId": "string"
        },
        "signedAt": "2019-08-24T14:15:22Z",
        "metadata": {
          "$class": "org.accordproject.protocol@1.0.0.Metadata",
          "values": [
            {
              "$class": "org.accordproject.protocol@1.0.0.KeyValue",
              "key": "string",
              "value": "string"
            }
          ]
        },
        "signatureImage": [
          {
            "$class": "org.accordproject.protocol@1.0.0.Blob",
            "base64": "string",
            "mimeType": "string"
          }
        ]
      }
    ],
    "historyEntries": [
      {
        "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
        "agreementStatus": "DRAFT",
        "data": "string",
        "metadata": {
          "$class": "org.accordproject.protocol@1.0.0.Metadata",
          "values": [
            {
              "$class": "org.accordproject.protocol@1.0.0.KeyValue",
              "key": "string",
              "value": "string"
            }
          ]
        }
      }
    ],
    "attachments": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Blob",
        "base64": "string",
        "mimeType": "string"
      }
    ],
    "references": [
      "string"
    ],
    "metadata": {
      "$class": "org.accordproject.protocol@1.0.0.Metadata",
      "values": [
        {
          "$class": "org.accordproject.protocol@1.0.0.KeyValue",
          "key": "string",
          "value": "string"
        }
      ]
    }
  }
]
```

<h3 id="listagreements-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns an array of `agreement` entities.|Inline|

<h3 id="listagreements-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[org.accordproject.protocol@1.0.0.Agreement](#schemaorg.accordproject.protocol@1.0.0.agreement)]|false|none|[An instance of org.accordproject.protocol@1.0.0.Agreement]|
|» Agreement|[org.accordproject.protocol@1.0.0.Agreement](#schemaorg.accordproject.protocol@1.0.0.agreement)|false|none|An instance of org.accordproject.protocol@1.0.0.Agreement|
|»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Agreement|
|»» uri|string|true|none|The instance identifier for this type|
|»» data|string|true|none|none|
|»» template|string|true|none|The identifier of an instance of org.accordproject.protocol@1.0.0.Template|
|»» state|string|false|none|none|
|»» agreementStatus|any|true|none|An instance of org.accordproject.protocol@1.0.0.AgreementStatusType|
|»» agreementParties|[[org.accordproject.protocol@1.0.0.AgreementParty](#schemaorg.accordproject.protocol@1.0.0.agreementparty)]|false|none|[An instance of org.accordproject.protocol@1.0.0.AgreementParty]|
|»»» AgreementParty|[org.accordproject.protocol@1.0.0.AgreementParty](#schemaorg.accordproject.protocol@1.0.0.agreementparty)|false|none|An instance of org.accordproject.protocol@1.0.0.AgreementParty|
|»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.AgreementParty|
|»»»» name|string|true|none|none|
|»»»» signatory|boolean|true|none|none|
|»»»» role|string|false|none|none|
|»»»» email|string|false|none|none|
|»»»» phone|string|false|none|none|
|»»»» company|string|false|none|none|
|»»»» network|string|false|none|none|
|»»»» address|[org.accordproject.protocol@1.0.0.Address](#schemaorg.accordproject.protocol@1.0.0.address)|false|none|An instance of org.accordproject.protocol@1.0.0.Address|
|»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Address|
|»»»»» streetRoad|[string]|true|none|none|
|»»»»» suburbTownCity|string|false|none|none|
|»»»»» stateTerritoryRegion|string|false|none|none|
|»»»»» postalCode|string|false|none|none|
|»»»»» country|string|false|none|none|
|»»»» partyId|string|true|none|The instance identifier for this type|
|»» signatures|[[org.accordproject.protocol@1.0.0.Signature](#schemaorg.accordproject.protocol@1.0.0.signature)]|false|none|[An instance of org.accordproject.protocol@1.0.0.Signature]|
|»»» Signature|[org.accordproject.protocol@1.0.0.Signature](#schemaorg.accordproject.protocol@1.0.0.signature)|false|none|An instance of org.accordproject.protocol@1.0.0.Signature|
|»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Signature|
|»»»» signatory|[org.accordproject.protocol@1.0.0.AgreementParty](#schemaorg.accordproject.protocol@1.0.0.agreementparty)|true|none|An instance of org.accordproject.protocol@1.0.0.AgreementParty|
|»»»» signedAt|string(date-time)|false|none|none|
|»»»» metadata|[org.accordproject.protocol@1.0.0.Metadata](#schemaorg.accordproject.protocol@1.0.0.metadata)|true|none|An instance of org.accordproject.protocol@1.0.0.Metadata|
|»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Metadata|
|»»»»» values|[[org.accordproject.protocol@1.0.0.KeyValue](#schemaorg.accordproject.protocol@1.0.0.keyvalue)]|true|none|[An instance of org.accordproject.protocol@1.0.0.KeyValue]|
|»»»»»» KeyValue|[org.accordproject.protocol@1.0.0.KeyValue](#schemaorg.accordproject.protocol@1.0.0.keyvalue)|false|none|An instance of org.accordproject.protocol@1.0.0.KeyValue|
|»»»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.KeyValue|
|»»»»»»» key|string|true|none|none|
|»»»»»»» value|string|true|none|none|
|»»»» signatureImage|[[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)]|true|none|[An instance of org.accordproject.protocol@1.0.0.Blob]|
|»»»»» Blob|[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)|false|none|An instance of org.accordproject.protocol@1.0.0.Blob|
|»»»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Blob|
|»»»»»» base64|string|true|none|none|
|»»»»»» mimeType|string|true|none|none|
|»» historyEntries|[[org.accordproject.protocol@1.0.0.HistoryEntry](#schemaorg.accordproject.protocol@1.0.0.historyentry)]|false|none|[An instance of org.accordproject.protocol@1.0.0.HistoryEntry]|
|»»» HistoryEntry|[org.accordproject.protocol@1.0.0.HistoryEntry](#schemaorg.accordproject.protocol@1.0.0.historyentry)|false|none|An instance of org.accordproject.protocol@1.0.0.HistoryEntry|
|»»»» $class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.HistoryEntry|
|»»»» agreementStatus|any|true|none|An instance of org.accordproject.protocol@1.0.0.AgreementStatusType|
|»»»» data|string|true|none|none|
|»»»» metadata|[org.accordproject.protocol@1.0.0.Metadata](#schemaorg.accordproject.protocol@1.0.0.metadata)|true|none|An instance of org.accordproject.protocol@1.0.0.Metadata|
|»» attachments|[[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)]|false|none|[An instance of org.accordproject.protocol@1.0.0.Blob]|
|»»» Blob|[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)|false|none|An instance of org.accordproject.protocol@1.0.0.Blob|
|»» references|[string]|false|none|none|
|»» metadata|[org.accordproject.protocol@1.0.0.Metadata](#schemaorg.accordproject.protocol@1.0.0.metadata)|false|none|An instance of org.accordproject.protocol@1.0.0.Metadata|

#### Enumerated Values

|Property|Value|
|---|---|
|agreementStatus|DRAFT|
|agreementStatus|SIGNNG|
|agreementStatus|COMPLETED|
|agreementStatus|SUPERSEDED|
|agreementStatus|DRAFT|
|agreementStatus|SIGNNG|
|agreementStatus|COMPLETED|
|agreementStatus|SUPERSEDED|

<aside class="success">
This operation does not require authentication
</aside>

## createAgreement

<a id="opIdcreateAgreement"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /agreements \
  -H 'Content-Type: application/json'

```

```http
POST /agreements HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "uri": "string",
  "data": "string",
  "template": "string",
  "state": "string",
  "agreementStatus": "DRAFT",
  "agreementParties": [
    {
      "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
      "name": "string",
      "signatory": true,
      "role": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "network": "string",
      "address": {
        "$class": "org.accordproject.protocol@1.0.0.Address",
        "streetRoad": [
          "string"
        ],
        "suburbTownCity": "string",
        "stateTerritoryRegion": "string",
        "postalCode": "string",
        "country": "string"
      },
      "partyId": "string"
    }
  ],
  "signatures": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Signature",
      "signatory": {
        "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
        "name": "string",
        "signatory": true,
        "role": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "network": "string",
        "address": {
          "$class": "org.accordproject.protocol@1.0.0.Address",
          "streetRoad": [
            "string"
          ],
          "suburbTownCity": "string",
          "stateTerritoryRegion": "string",
          "postalCode": "string",
          "country": "string"
        },
        "partyId": "string"
      },
      "signedAt": "2019-08-24T14:15:22Z",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      },
      "signatureImage": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Blob",
          "base64": "string",
          "mimeType": "string"
        }
      ]
    }
  ],
  "historyEntries": [
    {
      "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
      "agreementStatus": "DRAFT",
      "data": "string",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      }
    }
  ],
  "attachments": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    }
  ],
  "references": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/agreements',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post '/agreements',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/agreements', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/agreements', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/agreements");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/agreements", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /agreements`

*Create a Agreement*

Creates a new instance of a `agreement`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "uri": "string",
  "data": "string",
  "template": "string",
  "state": "string",
  "agreementStatus": "DRAFT",
  "agreementParties": [
    {
      "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
      "name": "string",
      "signatory": true,
      "role": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "network": "string",
      "address": {
        "$class": "org.accordproject.protocol@1.0.0.Address",
        "streetRoad": [
          "string"
        ],
        "suburbTownCity": "string",
        "stateTerritoryRegion": "string",
        "postalCode": "string",
        "country": "string"
      },
      "partyId": "string"
    }
  ],
  "signatures": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Signature",
      "signatory": {
        "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
        "name": "string",
        "signatory": true,
        "role": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "network": "string",
        "address": {
          "$class": "org.accordproject.protocol@1.0.0.Address",
          "streetRoad": [
            "string"
          ],
          "suburbTownCity": "string",
          "stateTerritoryRegion": "string",
          "postalCode": "string",
          "country": "string"
        },
        "partyId": "string"
      },
      "signedAt": "2019-08-24T14:15:22Z",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      },
      "signatureImage": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Blob",
          "base64": "string",
          "mimeType": "string"
        }
      ]
    }
  ],
  "historyEntries": [
    {
      "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
      "agreementStatus": "DRAFT",
      "data": "string",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      }
    }
  ],
  "attachments": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    }
  ],
  "references": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  }
}
```

<h3 id="createagreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.Agreement](#schemaorg.accordproject.protocol@1.0.0.agreement)|true|A new `agreement` to be created.|

<h3 id="createagreement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## getAgreement

<a id="opIdgetAgreement"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /agreements/{uri} \
  -H 'Accept: application/json'

```

```http
GET /agreements/{uri} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/agreements/{uri}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/agreements/{uri}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/agreements/{uri}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/agreements/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/agreements/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/agreements/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /agreements/{uri}`

*Get a agreement*

Gets the details of a single instance of a `agreement`.

<h3 id="getagreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|uri|path|string|true|A unique identifier for a `Agreement`.|

> Example responses

> 200 Response

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "uri": "string",
  "data": "string",
  "template": "string",
  "state": "string",
  "agreementStatus": "DRAFT",
  "agreementParties": [
    {
      "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
      "name": "string",
      "signatory": true,
      "role": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "network": "string",
      "address": {
        "$class": "org.accordproject.protocol@1.0.0.Address",
        "streetRoad": [
          "string"
        ],
        "suburbTownCity": "string",
        "stateTerritoryRegion": "string",
        "postalCode": "string",
        "country": "string"
      },
      "partyId": "string"
    }
  ],
  "signatures": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Signature",
      "signatory": {
        "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
        "name": "string",
        "signatory": true,
        "role": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "network": "string",
        "address": {
          "$class": "org.accordproject.protocol@1.0.0.Address",
          "streetRoad": [
            "string"
          ],
          "suburbTownCity": "string",
          "stateTerritoryRegion": "string",
          "postalCode": "string",
          "country": "string"
        },
        "partyId": "string"
      },
      "signedAt": "2019-08-24T14:15:22Z",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      },
      "signatureImage": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Blob",
          "base64": "string",
          "mimeType": "string"
        }
      ]
    }
  ],
  "historyEntries": [
    {
      "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
      "agreementStatus": "DRAFT",
      "data": "string",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      }
    }
  ],
  "attachments": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    }
  ],
  "references": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  }
}
```

<h3 id="getagreement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns a single `agreement`.|[org.accordproject.protocol@1.0.0.Agreement](#schemaorg.accordproject.protocol@1.0.0.agreement)|

<aside class="success">
This operation does not require authentication
</aside>

## replaceAgreement

<a id="opIdreplaceAgreement"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT /agreements/{uri} \
  -H 'Content-Type: application/json'

```

```http
PUT /agreements/{uri} HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "uri": "string",
  "data": "string",
  "template": "string",
  "state": "string",
  "agreementStatus": "DRAFT",
  "agreementParties": [
    {
      "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
      "name": "string",
      "signatory": true,
      "role": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "network": "string",
      "address": {
        "$class": "org.accordproject.protocol@1.0.0.Address",
        "streetRoad": [
          "string"
        ],
        "suburbTownCity": "string",
        "stateTerritoryRegion": "string",
        "postalCode": "string",
        "country": "string"
      },
      "partyId": "string"
    }
  ],
  "signatures": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Signature",
      "signatory": {
        "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
        "name": "string",
        "signatory": true,
        "role": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "network": "string",
        "address": {
          "$class": "org.accordproject.protocol@1.0.0.Address",
          "streetRoad": [
            "string"
          ],
          "suburbTownCity": "string",
          "stateTerritoryRegion": "string",
          "postalCode": "string",
          "country": "string"
        },
        "partyId": "string"
      },
      "signedAt": "2019-08-24T14:15:22Z",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      },
      "signatureImage": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Blob",
          "base64": "string",
          "mimeType": "string"
        }
      ]
    }
  ],
  "historyEntries": [
    {
      "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
      "agreementStatus": "DRAFT",
      "data": "string",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      }
    }
  ],
  "attachments": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    }
  ],
  "references": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/agreements/{uri}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put '/agreements/{uri}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('/agreements/{uri}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','/agreements/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/agreements/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "/agreements/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /agreements/{uri}`

*Update a agreement*

Updates an existing `agreement`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "uri": "string",
  "data": "string",
  "template": "string",
  "state": "string",
  "agreementStatus": "DRAFT",
  "agreementParties": [
    {
      "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
      "name": "string",
      "signatory": true,
      "role": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "network": "string",
      "address": {
        "$class": "org.accordproject.protocol@1.0.0.Address",
        "streetRoad": [
          "string"
        ],
        "suburbTownCity": "string",
        "stateTerritoryRegion": "string",
        "postalCode": "string",
        "country": "string"
      },
      "partyId": "string"
    }
  ],
  "signatures": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Signature",
      "signatory": {
        "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
        "name": "string",
        "signatory": true,
        "role": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "network": "string",
        "address": {
          "$class": "org.accordproject.protocol@1.0.0.Address",
          "streetRoad": [
            "string"
          ],
          "suburbTownCity": "string",
          "stateTerritoryRegion": "string",
          "postalCode": "string",
          "country": "string"
        },
        "partyId": "string"
      },
      "signedAt": "2019-08-24T14:15:22Z",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      },
      "signatureImage": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Blob",
          "base64": "string",
          "mimeType": "string"
        }
      ]
    }
  ],
  "historyEntries": [
    {
      "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
      "agreementStatus": "DRAFT",
      "data": "string",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      }
    }
  ],
  "attachments": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    }
  ],
  "references": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  }
}
```

<h3 id="replaceagreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.Agreement](#schemaorg.accordproject.protocol@1.0.0.agreement)|true|Updated `agreement` information.|
|uri|path|string|true|A unique identifier for a `Agreement`.|

<h3 id="replaceagreement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## deleteAgreement

<a id="opIddeleteAgreement"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /agreements/{uri}

```

```http
DELETE /agreements/{uri} HTTP/1.1

```

```javascript

fetch('/agreements/{uri}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete '/agreements/{uri}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('/agreements/{uri}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/agreements/{uri}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/agreements/{uri}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/agreements/{uri}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /agreements/{uri}`

*Delete a agreement*

Deletes an existing `agreement`.

<h3 id="deleteagreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|uri|path|string|true|A unique identifier for a `Agreement`.|

<h3 id="deleteagreement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## convertAgreementHtml

<a id="opIdconvertAgreementHtml"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /agreements/{agreementId}/convert/html \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/pdf:'

```

```http
POST /agreements/{agreementId}/convert/html HTTP/1.1

Content-Type: application/json
Accept: application/pdf:

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.HtmlConversionOptions"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/pdf:'
};

fetch('/agreements/{agreementId}/convert/html',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/pdf:'
}

result = RestClient.post '/agreements/{agreementId}/convert/html',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/pdf:'
}

r = requests.post('/agreements/{agreementId}/convert/html', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/pdf:',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/agreements/{agreementId}/convert/html', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/agreements/{agreementId}/convert/html");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/pdf:"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/agreements/{agreementId}/convert/html", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /agreements/{agreementId}/convert/html`

*Convert agreement to HTML*

Converts an existing `agreement` to HTML.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.HtmlConversionOptions"
}
```

<h3 id="convertagreementhtml-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.HtmlConversionOptions](#schemaorg.accordproject.protocol@1.0.0.htmlconversionoptions)|true|HTML conversion options.|
|agreementId|path|string|true|A unique identifier for a `Agreement`.|

> Example responses

> 202 Response

<h3 id="convertagreementhtml-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|A HTML file|string|

<aside class="success">
This operation does not require authentication
</aside>

## triggerAgreement

<a id="opIdtriggerAgreement"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /agreements/{agreementId}/trigger \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /agreements/{agreementId}/trigger HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.TriggerRequest",
  "payload": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/agreements/{agreementId}/trigger',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/agreements/{agreementId}/trigger',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/agreements/{agreementId}/trigger', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/agreements/{agreementId}/trigger', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/agreements/{agreementId}/trigger");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/agreements/{agreementId}/trigger", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /agreements/{agreementId}/trigger`

*Trigger an agreement*

Sends data to an existing agreement.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.TriggerRequest",
  "payload": "string"
}
```

<h3 id="triggeragreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.TriggerRequest](#schemaorg.accordproject.protocol@1.0.0.triggerrequest)|true|Incoming data — a JSON serialized Concerto type|
|agreementId|path|string|true|A unique identifier for a `Agreement`.|

> Example responses

> 200 Response

```json
{
  "$class": "org.accordproject.protocol@1.0.0.TriggerResponse",
  "result": "string",
  "isError": true,
  "errorMessage": "string",
  "errorDetails": "string"
}
```

<h3 id="triggeragreement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns the result of calling a function.|[org.accordproject.protocol@1.0.0.TriggerResponse](#schemaorg.accordproject.protocol@1.0.0.triggerresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="accord-protocol-capabilities">capabilities</h1>

## getCapabilities

<a id="opIdgetCapabilities"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /capabilities \
  -H 'Accept: application/json'

```

```http
GET /capabilities HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/capabilities',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/capabilities',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/capabilities', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/capabilities', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/capabilities");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/capabilities", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /capabilities`

*Get server capabilities*

Retrieve the supported features of the server.

> Example responses

> 200 Response

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Capabilities",
  "features": [
    "TEMPLATE_MANAGE"
  ]
}
```

<h3 id="getcapabilities-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response - returns `capabilities` for the server.|[org.accordproject.protocol@1.0.0.Capabilities](#schemaorg.accordproject.protocol@1.0.0.capabilities)|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_org.accordproject.protocol@1.0.0.URI">org.accordproject.protocol@1.0.0.URI</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.uri"></a>
<a id="schema_org.accordproject.protocol@1.0.0.URI"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.uri"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.uri"></a>

```json
"string"

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.JSON">org.accordproject.protocol@1.0.0.JSON</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.json"></a>
<a id="schema_org.accordproject.protocol@1.0.0.JSON"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.json"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.json"></a>

```json
"string"

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.FullyQualifiedTypeName">org.accordproject.protocol@1.0.0.FullyQualifiedTypeName</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.fullyqualifiedtypename"></a>
<a id="schema_org.accordproject.protocol@1.0.0.FullyQualifiedTypeName"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.fullyqualifiedtypename"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.fullyqualifiedtypename"></a>

```json
"string"

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Blob">org.accordproject.protocol@1.0.0.Blob</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.blob"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Blob"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.blob"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.blob"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Blob",
  "base64": "string",
  "mimeType": "string"
}

```

Blob

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Blob|
|base64|string|true|none|none|
|mimeType|string|true|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Text">org.accordproject.protocol@1.0.0.Text</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.text"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Text"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.text"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.text"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Text",
  "templateMark": {
    "$class": "org.accordproject.commonmark@0.5.0.Document",
    "xmlns": "string",
    "text": "string",
    "nodes": [
      {
        "$class": "org.accordproject.commonmark@0.5.0.Node",
        "text": "string",
        "nodes": [
          {
            "$class": "org.accordproject.commonmark@0.5.0.Node",
            "text": "string",
            "nodes": [],
            "startLine": 0,
            "endLine": 0
          }
        ],
        "startLine": 0,
        "endLine": 0
      }
    ],
    "startLine": 0,
    "endLine": 0
  },
  "templateText": "string"
}

```

Text

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Text|
|templateMark|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|
|templateText|string|false|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.DomainModel">org.accordproject.protocol@1.0.0.DomainModel</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.domainmodel"></a>
<a id="schema_org.accordproject.protocol@1.0.0.DomainModel"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.domainmodel"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.domainmodel"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.DomainModel"
}

```

DomainModel

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.DomainModel|

<h2 id="tocS_org.accordproject.protocol@1.0.0.CtoFile">org.accordproject.protocol@1.0.0.CtoFile</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.ctofile"></a>
<a id="schema_org.accordproject.protocol@1.0.0.CtoFile"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.ctofile"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.ctofile"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.CtoFile",
  "contents": "string",
  "filename": "string"
}

```

CtoFile

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.CtoFile|
|contents|string|true|none|none|
|filename|string|true|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.CtoModel">org.accordproject.protocol@1.0.0.CtoModel</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.ctomodel"></a>
<a id="schema_org.accordproject.protocol@1.0.0.CtoModel"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.ctomodel"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.ctomodel"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.CtoModel",
  "ctoFiles": [
    {
      "$class": "org.accordproject.protocol@1.0.0.CtoFile",
      "contents": "string",
      "filename": "string"
    }
  ]
}

```

CtoModel

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.CtoModel|
|ctoFiles|[[org.accordproject.protocol@1.0.0.CtoFile](#schemaorg.accordproject.protocol@1.0.0.ctofile)]|true|none|[An instance of org.accordproject.protocol@1.0.0.CtoFile]|

<h2 id="tocS_org.accordproject.protocol@1.0.0.JsonModel">org.accordproject.protocol@1.0.0.JsonModel</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.jsonmodel"></a>
<a id="schema_org.accordproject.protocol@1.0.0.JsonModel"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.jsonmodel"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.jsonmodel"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.JsonModel",
  "model": {
    "$class": "concerto.metamodel@0.4.0.Model",
    "namespace": "string",
    "sourceUri": "string",
    "concertoVersion": "string",
    "imports": [
      {
        "$class": "concerto.metamodel@0.4.0.Import",
        "namespace": "string",
        "uri": "string"
      }
    ],
    "declarations": [
      {
        "$class": "concerto.metamodel@0.4.0.Declaration",
        "name": "string",
        "decorators": [
          {
            "$class": "concerto.metamodel@0.4.0.Decorator",
            "name": "string",
            "arguments": [
              {
                "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                "location": {
                  "$class": "concerto.metamodel@0.4.0.Range",
                  "start": {
                    "$class": "concerto.metamodel@0.4.0.Position",
                    "line": 0,
                    "column": 0,
                    "offset": 0
                  },
                  "end": {
                    "$class": "concerto.metamodel@0.4.0.Position",
                    "line": 0,
                    "column": 0,
                    "offset": 0
                  },
                  "source": "string"
                }
              }
            ],
            "location": {
              "$class": "concerto.metamodel@0.4.0.Range",
              "start": {
                "$class": "concerto.metamodel@0.4.0.Position",
                "line": 0,
                "column": 0,
                "offset": 0
              },
              "end": {
                "$class": "concerto.metamodel@0.4.0.Position",
                "line": 0,
                "column": 0,
                "offset": 0
              },
              "source": "string"
            }
          }
        ],
        "location": {
          "$class": "concerto.metamodel@0.4.0.Range",
          "start": {
            "$class": "concerto.metamodel@0.4.0.Position",
            "line": 0,
            "column": 0,
            "offset": 0
          },
          "end": {
            "$class": "concerto.metamodel@0.4.0.Position",
            "line": 0,
            "column": 0,
            "offset": 0
          },
          "source": "string"
        }
      }
    ]
  }
}

```

JsonModel

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.JsonModel|
|model|[concerto.metamodel@0.4.0.Model](#schemaconcerto.metamodel@0.4.0.model)|false|none|An instance of concerto.metamodel@0.4.0.Model|

<h2 id="tocS_org.accordproject.protocol@1.0.0.TemplateModel">org.accordproject.protocol@1.0.0.TemplateModel</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.templatemodel"></a>
<a id="schema_org.accordproject.protocol@1.0.0.TemplateModel"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.templatemodel"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.templatemodel"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
  "typeName": "string",
  "sharedModel": "string",
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.DomainModel"
  }
}

```

TemplateModel

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.TemplateModel|
|typeName|string|true|none|none|
|sharedModel|string|false|none|The identifier of an instance of org.accordproject.protocol@1.0.0.SharedModel|
|model|any|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.protocol@1.0.0.DomainModel](#schemaorg.accordproject.protocol@1.0.0.domainmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.DomainModel|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.protocol@1.0.0.CtoModel](#schemaorg.accordproject.protocol@1.0.0.ctomodel)|false|none|An instance of org.accordproject.protocol@1.0.0.CtoModel|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.protocol@1.0.0.JsonModel](#schemaorg.accordproject.protocol@1.0.0.jsonmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.JsonModel|

<h2 id="tocS_org.accordproject.protocol@1.0.0.SharedModel">org.accordproject.protocol@1.0.0.SharedModel</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.sharedmodel"></a>
<a id="schema_org.accordproject.protocol@1.0.0.SharedModel"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.sharedmodel"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.sharedmodel"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.SharedModel",
  "uri": "string",
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.DomainModel"
  }
}

```

SharedModel

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.SharedModel|
|uri|string|true|none|The instance identifier for this type|
|model|any|true|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.protocol@1.0.0.DomainModel](#schemaorg.accordproject.protocol@1.0.0.domainmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.DomainModel|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.protocol@1.0.0.CtoModel](#schemaorg.accordproject.protocol@1.0.0.ctomodel)|false|none|An instance of org.accordproject.protocol@1.0.0.CtoModel|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.protocol@1.0.0.JsonModel](#schemaorg.accordproject.protocol@1.0.0.jsonmodel)|false|none|An instance of org.accordproject.protocol@1.0.0.JsonModel|

<h2 id="tocS_org.accordproject.protocol@1.0.0.CodeType">org.accordproject.protocol@1.0.0.CodeType</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.codetype"></a>
<a id="schema_org.accordproject.protocol@1.0.0.CodeType"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.codetype"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.codetype"></a>

```json
"ES2015"

```

CodeType

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|CodeType|any|false|none|An instance of org.accordproject.protocol@1.0.0.CodeType|

#### Enumerated Values

|Property|Value|
|---|---|
|CodeType|ES2015|
|CodeType|WASM_BYTES|
|CodeType|TYPESCRIPT|

<h2 id="tocS_org.accordproject.protocol@1.0.0.CodeEncodingType">org.accordproject.protocol@1.0.0.CodeEncodingType</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.codeencodingtype"></a>
<a id="schema_org.accordproject.protocol@1.0.0.CodeEncodingType"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.codeencodingtype"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.codeencodingtype"></a>

```json
"PLAIN_TEXT"

```

CodeEncodingType

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|CodeEncodingType|any|false|none|An instance of org.accordproject.protocol@1.0.0.CodeEncodingType|

#### Enumerated Values

|Property|Value|
|---|---|
|CodeEncodingType|PLAIN_TEXT|
|CodeEncodingType|BASE64|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Code">org.accordproject.protocol@1.0.0.Code</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.code"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Code"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.code"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.code"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Code",
  "id": "string",
  "type": "ES2015",
  "encoding": "PLAIN_TEXT",
  "value": "string"
}

```

Code

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Code|
|id|string|true|none|The instance identifier for this type|
|type|[org.accordproject.protocol@1.0.0.CodeType](#schemaorg.accordproject.protocol@1.0.0.codetype)|true|none|An instance of org.accordproject.protocol@1.0.0.CodeType|
|encoding|[org.accordproject.protocol@1.0.0.CodeEncodingType](#schemaorg.accordproject.protocol@1.0.0.codeencodingtype)|true|none|An instance of org.accordproject.protocol@1.0.0.CodeEncodingType|
|value|string|true|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Logic">org.accordproject.protocol@1.0.0.Logic</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.logic"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Logic"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.logic"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.logic"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Logic",
  "stateType": "string",
  "codes": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Code",
      "id": "string",
      "type": "ES2015",
      "encoding": "PLAIN_TEXT",
      "value": "string"
    }
  ]
}

```

Logic

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Logic|
|stateType|string|false|none|none|
|codes|[[org.accordproject.protocol@1.0.0.Code](#schemaorg.accordproject.protocol@1.0.0.code)]|true|none|[An instance of org.accordproject.protocol@1.0.0.Code]|

<h2 id="tocS_org.accordproject.protocol@1.0.0.TemplateMetadata">org.accordproject.protocol@1.0.0.TemplateMetadata</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.templatemetadata"></a>
<a id="schema_org.accordproject.protocol@1.0.0.TemplateMetadata"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.templatemetadata"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.templatemetadata"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
  "runtime": "string",
  "template": "string",
  "cicero": "string"
}

```

TemplateMetadata

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.TemplateMetadata|
|runtime|string|true|none|none|
|template|string|true|none|none|
|cicero|string|true|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Template">org.accordproject.protocol@1.0.0.Template</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.template"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Template"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.template"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.template"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "uri": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
    "runtime": "string",
    "template": "string",
    "cicero": "string"
  },
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Blob",
    "base64": "string",
    "mimeType": "string"
  },
  "templateModel": {
    "$class": "org.accordproject.protocol@1.0.0.TemplateModel",
    "typeName": "string",
    "sharedModel": "string",
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.DomainModel"
    }
  },
  "text": {
    "$class": "org.accordproject.protocol@1.0.0.Text",
    "templateMark": {
      "$class": "org.accordproject.commonmark@0.5.0.Document",
      "xmlns": "string",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark@0.5.0.Node",
              "text": "string",
              "nodes": [],
              "startLine": 0,
              "endLine": 0
            }
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    },
    "templateText": "string"
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "stateType": "string",
    "codes": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Code",
        "id": "string",
        "type": "ES2015",
        "encoding": "PLAIN_TEXT",
        "value": "string"
      }
    ]
  },
  "sampleRequest": "string"
}

```

Template

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Template|
|uri|string|true|none|The instance identifier for this type|
|author|string|true|none|none|
|displayName|string|false|none|none|
|version|string|true|none|none|
|description|string|false|none|none|
|license|string|true|none|none|
|keywords|[string]|false|none|none|
|metadata|[org.accordproject.protocol@1.0.0.TemplateMetadata](#schemaorg.accordproject.protocol@1.0.0.templatemetadata)|true|none|An instance of org.accordproject.protocol@1.0.0.TemplateMetadata|
|logo|[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)|false|none|An instance of org.accordproject.protocol@1.0.0.Blob|
|templateModel|[org.accordproject.protocol@1.0.0.TemplateModel](#schemaorg.accordproject.protocol@1.0.0.templatemodel)|true|none|An instance of org.accordproject.protocol@1.0.0.TemplateModel|
|text|[org.accordproject.protocol@1.0.0.Text](#schemaorg.accordproject.protocol@1.0.0.text)|true|none|An instance of org.accordproject.protocol@1.0.0.Text|
|logic|[org.accordproject.protocol@1.0.0.Logic](#schemaorg.accordproject.protocol@1.0.0.logic)|false|none|An instance of org.accordproject.protocol@1.0.0.Logic|
|sampleRequest|string|false|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.KeyValue">org.accordproject.protocol@1.0.0.KeyValue</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.keyvalue"></a>
<a id="schema_org.accordproject.protocol@1.0.0.KeyValue"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.keyvalue"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.keyvalue"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.KeyValue",
  "key": "string",
  "value": "string"
}

```

KeyValue

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.KeyValue|
|key|string|true|none|none|
|value|string|true|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Metadata">org.accordproject.protocol@1.0.0.Metadata</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.metadata"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Metadata"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.metadata"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.metadata"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Metadata",
  "values": [
    {
      "$class": "org.accordproject.protocol@1.0.0.KeyValue",
      "key": "string",
      "value": "string"
    }
  ]
}

```

Metadata

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Metadata|
|values|[[org.accordproject.protocol@1.0.0.KeyValue](#schemaorg.accordproject.protocol@1.0.0.keyvalue)]|true|none|[An instance of org.accordproject.protocol@1.0.0.KeyValue]|

<h2 id="tocS_org.accordproject.protocol@1.0.0.AgreementStatusType">org.accordproject.protocol@1.0.0.AgreementStatusType</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.agreementstatustype"></a>
<a id="schema_org.accordproject.protocol@1.0.0.AgreementStatusType"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.agreementstatustype"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.agreementstatustype"></a>

```json
"DRAFT"

```

AgreementStatusType

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|AgreementStatusType|any|false|none|An instance of org.accordproject.protocol@1.0.0.AgreementStatusType|

#### Enumerated Values

|Property|Value|
|---|---|
|AgreementStatusType|DRAFT|
|AgreementStatusType|SIGNNG|
|AgreementStatusType|COMPLETED|
|AgreementStatusType|SUPERSEDED|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Agreement">org.accordproject.protocol@1.0.0.Agreement</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.agreement"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Agreement"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.agreement"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.agreement"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "uri": "string",
  "data": "string",
  "template": "string",
  "state": "string",
  "agreementStatus": "DRAFT",
  "agreementParties": [
    {
      "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
      "name": "string",
      "signatory": true,
      "role": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "network": "string",
      "address": {
        "$class": "org.accordproject.protocol@1.0.0.Address",
        "streetRoad": [
          "string"
        ],
        "suburbTownCity": "string",
        "stateTerritoryRegion": "string",
        "postalCode": "string",
        "country": "string"
      },
      "partyId": "string"
    }
  ],
  "signatures": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Signature",
      "signatory": {
        "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
        "name": "string",
        "signatory": true,
        "role": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "network": "string",
        "address": {
          "$class": "org.accordproject.protocol@1.0.0.Address",
          "streetRoad": [
            "string"
          ],
          "suburbTownCity": "string",
          "stateTerritoryRegion": "string",
          "postalCode": "string",
          "country": "string"
        },
        "partyId": "string"
      },
      "signedAt": "2019-08-24T14:15:22Z",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      },
      "signatureImage": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Blob",
          "base64": "string",
          "mimeType": "string"
        }
      ]
    }
  ],
  "historyEntries": [
    {
      "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
      "agreementStatus": "DRAFT",
      "data": "string",
      "metadata": {
        "$class": "org.accordproject.protocol@1.0.0.Metadata",
        "values": [
          {
            "$class": "org.accordproject.protocol@1.0.0.KeyValue",
            "key": "string",
            "value": "string"
          }
        ]
      }
    }
  ],
  "attachments": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    }
  ],
  "references": [
    "string"
  ],
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  }
}

```

Agreement

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Agreement|
|uri|string|true|none|The instance identifier for this type|
|data|string|true|none|none|
|template|string|true|none|The identifier of an instance of org.accordproject.protocol@1.0.0.Template|
|state|string|false|none|none|
|agreementStatus|[org.accordproject.protocol@1.0.0.AgreementStatusType](#schemaorg.accordproject.protocol@1.0.0.agreementstatustype)|true|none|An instance of org.accordproject.protocol@1.0.0.AgreementStatusType|
|agreementParties|[[org.accordproject.protocol@1.0.0.AgreementParty](#schemaorg.accordproject.protocol@1.0.0.agreementparty)]|false|none|[An instance of org.accordproject.protocol@1.0.0.AgreementParty]|
|signatures|[[org.accordproject.protocol@1.0.0.Signature](#schemaorg.accordproject.protocol@1.0.0.signature)]|false|none|[An instance of org.accordproject.protocol@1.0.0.Signature]|
|historyEntries|[[org.accordproject.protocol@1.0.0.HistoryEntry](#schemaorg.accordproject.protocol@1.0.0.historyentry)]|false|none|[An instance of org.accordproject.protocol@1.0.0.HistoryEntry]|
|attachments|[[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)]|false|none|[An instance of org.accordproject.protocol@1.0.0.Blob]|
|references|[string]|false|none|none|
|metadata|[org.accordproject.protocol@1.0.0.Metadata](#schemaorg.accordproject.protocol@1.0.0.metadata)|false|none|An instance of org.accordproject.protocol@1.0.0.Metadata|

<h2 id="tocS_org.accordproject.protocol@1.0.0.AgreementParty">org.accordproject.protocol@1.0.0.AgreementParty</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.agreementparty"></a>
<a id="schema_org.accordproject.protocol@1.0.0.AgreementParty"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.agreementparty"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.agreementparty"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
  "name": "string",
  "signatory": true,
  "role": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "network": "string",
  "address": {
    "$class": "org.accordproject.protocol@1.0.0.Address",
    "streetRoad": [
      "string"
    ],
    "suburbTownCity": "string",
    "stateTerritoryRegion": "string",
    "postalCode": "string",
    "country": "string"
  },
  "partyId": "string"
}

```

AgreementParty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.AgreementParty|
|name|string|true|none|none|
|signatory|boolean|true|none|none|
|role|string|false|none|none|
|email|string|false|none|none|
|phone|string|false|none|none|
|company|string|false|none|none|
|network|string|false|none|none|
|address|[org.accordproject.protocol@1.0.0.Address](#schemaorg.accordproject.protocol@1.0.0.address)|false|none|An instance of org.accordproject.protocol@1.0.0.Address|
|partyId|string|true|none|The instance identifier for this type|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Address">org.accordproject.protocol@1.0.0.Address</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.address"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Address"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.address"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.address"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Address",
  "streetRoad": [
    "string"
  ],
  "suburbTownCity": "string",
  "stateTerritoryRegion": "string",
  "postalCode": "string",
  "country": "string"
}

```

Address

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Address|
|streetRoad|[string]|true|none|none|
|suburbTownCity|string|false|none|none|
|stateTerritoryRegion|string|false|none|none|
|postalCode|string|false|none|none|
|country|string|false|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.HistoryEntry">org.accordproject.protocol@1.0.0.HistoryEntry</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.historyentry"></a>
<a id="schema_org.accordproject.protocol@1.0.0.HistoryEntry"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.historyentry"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.historyentry"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.HistoryEntry",
  "agreementStatus": "DRAFT",
  "data": "string",
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  }
}

```

HistoryEntry

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.HistoryEntry|
|agreementStatus|[org.accordproject.protocol@1.0.0.AgreementStatusType](#schemaorg.accordproject.protocol@1.0.0.agreementstatustype)|true|none|An instance of org.accordproject.protocol@1.0.0.AgreementStatusType|
|data|string|true|none|none|
|metadata|[org.accordproject.protocol@1.0.0.Metadata](#schemaorg.accordproject.protocol@1.0.0.metadata)|true|none|An instance of org.accordproject.protocol@1.0.0.Metadata|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Signature">org.accordproject.protocol@1.0.0.Signature</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.signature"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Signature"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.signature"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.signature"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Signature",
  "signatory": {
    "$class": "org.accordproject.protocol@1.0.0.AgreementParty",
    "name": "string",
    "signatory": true,
    "role": "string",
    "email": "string",
    "phone": "string",
    "company": "string",
    "network": "string",
    "address": {
      "$class": "org.accordproject.protocol@1.0.0.Address",
      "streetRoad": [
        "string"
      ],
      "suburbTownCity": "string",
      "stateTerritoryRegion": "string",
      "postalCode": "string",
      "country": "string"
    },
    "partyId": "string"
  },
  "signedAt": "2019-08-24T14:15:22Z",
  "metadata": {
    "$class": "org.accordproject.protocol@1.0.0.Metadata",
    "values": [
      {
        "$class": "org.accordproject.protocol@1.0.0.KeyValue",
        "key": "string",
        "value": "string"
      }
    ]
  },
  "signatureImage": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Blob",
      "base64": "string",
      "mimeType": "string"
    }
  ]
}

```

Signature

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Signature|
|signatory|[org.accordproject.protocol@1.0.0.AgreementParty](#schemaorg.accordproject.protocol@1.0.0.agreementparty)|true|none|An instance of org.accordproject.protocol@1.0.0.AgreementParty|
|signedAt|string(date-time)|false|none|none|
|metadata|[org.accordproject.protocol@1.0.0.Metadata](#schemaorg.accordproject.protocol@1.0.0.metadata)|true|none|An instance of org.accordproject.protocol@1.0.0.Metadata|
|signatureImage|[[org.accordproject.protocol@1.0.0.Blob](#schemaorg.accordproject.protocol@1.0.0.blob)]|true|none|[An instance of org.accordproject.protocol@1.0.0.Blob]|

<h2 id="tocS_org.accordproject.protocol@1.0.0.ConversionOptions">org.accordproject.protocol@1.0.0.ConversionOptions</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.conversionoptions"></a>
<a id="schema_org.accordproject.protocol@1.0.0.ConversionOptions"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.conversionoptions"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.conversionoptions"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.ConversionOptions"
}

```

ConversionOptions

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.ConversionOptions|

<h2 id="tocS_org.accordproject.protocol@1.0.0.HtmlConversionOptions">org.accordproject.protocol@1.0.0.HtmlConversionOptions</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.htmlconversionoptions"></a>
<a id="schema_org.accordproject.protocol@1.0.0.HtmlConversionOptions"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.htmlconversionoptions"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.htmlconversionoptions"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.HtmlConversionOptions"
}

```

HtmlConversionOptions

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.HtmlConversionOptions|

<h2 id="tocS_org.accordproject.protocol@1.0.0.FeatureType">org.accordproject.protocol@1.0.0.FeatureType</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.featuretype"></a>
<a id="schema_org.accordproject.protocol@1.0.0.FeatureType"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.featuretype"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.featuretype"></a>

```json
"TEMPLATE_MANAGE"

```

FeatureType

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|FeatureType|any|false|none|An instance of org.accordproject.protocol@1.0.0.FeatureType|

#### Enumerated Values

|Property|Value|
|---|---|
|FeatureType|TEMPLATE_MANAGE|
|FeatureType|TEMPLATE_VERIFY_SIGNATURES|
|FeatureType|TEMPLATE_LOGIC|
|FeatureType|TEMPLATE_STATEFUL|
|FeatureType|LOGIC_WASM|
|FeatureType|LOGIC_ES2015|
|FeatureType|LOGIC_TYPESCRIPT|
|FeatureType|AGREEMENT_MANAGE|
|FeatureType|AGREEMENT_TRIGGER|
|FeatureType|AGREEMENT_STATE|
|FeatureType|AGREEMENT_CONVERT_HTML|
|FeatureType|AGREEMENT_SIGNING|
|FeatureType|SHARED_MODEL_MANAGE|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Capabilities">org.accordproject.protocol@1.0.0.Capabilities</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.capabilities"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Capabilities"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.capabilities"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.capabilities"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Capabilities",
  "features": [
    "TEMPLATE_MANAGE"
  ]
}

```

Capabilities

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.Capabilities|
|features|[[org.accordproject.protocol@1.0.0.FeatureType](#schemaorg.accordproject.protocol@1.0.0.featuretype)]|true|none|[An instance of org.accordproject.protocol@1.0.0.FeatureType]|

<h2 id="tocS_org.accordproject.protocol@1.0.0.TriggerRequest">org.accordproject.protocol@1.0.0.TriggerRequest</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.triggerrequest"></a>
<a id="schema_org.accordproject.protocol@1.0.0.TriggerRequest"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.triggerrequest"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.triggerrequest"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.TriggerRequest",
  "payload": "string"
}

```

TriggerRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.TriggerRequest|
|payload|string|true|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.TriggerResponse">org.accordproject.protocol@1.0.0.TriggerResponse</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.triggerresponse"></a>
<a id="schema_org.accordproject.protocol@1.0.0.TriggerResponse"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.triggerresponse"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.triggerresponse"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.TriggerResponse",
  "result": "string",
  "isError": true,
  "errorMessage": "string",
  "errorDetails": "string"
}

```

TriggerResponse

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.protocol@1.0.0.TriggerResponse|
|result|string|false|none|none|
|isError|boolean|true|none|none|
|errorMessage|string|false|none|none|
|errorDetails|string|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Node">org.accordproject.commonmark@0.5.0.Node</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.node"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Node"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.node"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.node"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Node",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Node

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Node|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Root">org.accordproject.commonmark@0.5.0.Root</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.root"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Root"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.root"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.root"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Root",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Root

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Root|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Child">org.accordproject.commonmark@0.5.0.Child</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.child"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Child"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.child"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.child"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Child",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Child

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Child|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Text">org.accordproject.commonmark@0.5.0.Text</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.text"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Text"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.text"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.text"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Text",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Text

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Text|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Attribute">org.accordproject.commonmark@0.5.0.Attribute</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.attribute"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Attribute"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.attribute"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.attribute"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Attribute",
  "name": "string",
  "value": "string"
}

```

Attribute

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Attribute|
|name|string|true|none|none|
|value|string|true|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.TagInfo">org.accordproject.commonmark@0.5.0.TagInfo</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.taginfo"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.TagInfo"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.taginfo"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.taginfo"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.TagInfo",
  "tagName": "string",
  "attributeString": "string",
  "attributes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Attribute",
      "name": "string",
      "value": "string"
    }
  ],
  "content": "string",
  "closed": true
}

```

TagInfo

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TagInfo|
|tagName|string|true|none|none|
|attributeString|string|true|none|none|
|attributes|[[org.accordproject.commonmark@0.5.0.Attribute](#schemaorg.accordproject.commonmark@0.5.0.attribute)]|true|none|[An instance of org.accordproject.commonmark@0.5.0.Attribute]|
|content|string|true|none|none|
|closed|boolean|true|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.CodeBlock">org.accordproject.commonmark@0.5.0.CodeBlock</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.codeblock"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.CodeBlock"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.codeblock"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.codeblock"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.CodeBlock",
  "info": "string",
  "tag": {
    "$class": "org.accordproject.commonmark@0.5.0.TagInfo",
    "tagName": "string",
    "attributeString": "string",
    "attributes": [
      {
        "$class": "org.accordproject.commonmark@0.5.0.Attribute",
        "name": "string",
        "value": "string"
      }
    ],
    "content": "string",
    "closed": true
  },
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

CodeBlock

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.CodeBlock|
|info|string|false|none|none|
|tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Code">org.accordproject.commonmark@0.5.0.Code</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.code"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Code"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.code"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.code"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Code",
  "info": "string",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Code

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Code|
|info|string|false|none|none|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.HtmlInline">org.accordproject.commonmark@0.5.0.HtmlInline</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.htmlinline"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.HtmlInline"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.htmlinline"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.htmlinline"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.HtmlInline",
  "tag": {
    "$class": "org.accordproject.commonmark@0.5.0.TagInfo",
    "tagName": "string",
    "attributeString": "string",
    "attributes": [
      {
        "$class": "org.accordproject.commonmark@0.5.0.Attribute",
        "name": "string",
        "value": "string"
      }
    ],
    "content": "string",
    "closed": true
  },
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

HtmlInline

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.HtmlInline|
|tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.HtmlBlock">org.accordproject.commonmark@0.5.0.HtmlBlock</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.htmlblock"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.HtmlBlock"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.htmlblock"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.htmlblock"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.HtmlBlock",
  "tag": {
    "$class": "org.accordproject.commonmark@0.5.0.TagInfo",
    "tagName": "string",
    "attributeString": "string",
    "attributes": [
      {
        "$class": "org.accordproject.commonmark@0.5.0.Attribute",
        "name": "string",
        "value": "string"
      }
    ],
    "content": "string",
    "closed": true
  },
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

HtmlBlock

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.HtmlBlock|
|tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Emph">org.accordproject.commonmark@0.5.0.Emph</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.emph"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Emph"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.emph"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.emph"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Emph",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Emph

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Emph|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Strong">org.accordproject.commonmark@0.5.0.Strong</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.strong"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Strong"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.strong"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.strong"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Strong",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Strong

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Strong|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.BlockQuote">org.accordproject.commonmark@0.5.0.BlockQuote</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.blockquote"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.BlockQuote"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.blockquote"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.blockquote"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.BlockQuote",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

BlockQuote

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.BlockQuote|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Heading">org.accordproject.commonmark@0.5.0.Heading</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.heading"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Heading"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.heading"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.heading"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Heading",
  "level": "string",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Heading

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Heading|
|level|string|true|none|none|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.ThematicBreak">org.accordproject.commonmark@0.5.0.ThematicBreak</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.thematicbreak"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.ThematicBreak"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.thematicbreak"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.thematicbreak"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.ThematicBreak",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

ThematicBreak

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.ThematicBreak|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Softbreak">org.accordproject.commonmark@0.5.0.Softbreak</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.softbreak"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Softbreak"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.softbreak"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.softbreak"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Softbreak",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Softbreak

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Softbreak|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Linebreak">org.accordproject.commonmark@0.5.0.Linebreak</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.linebreak"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Linebreak"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.linebreak"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.linebreak"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Linebreak",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Linebreak

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Linebreak|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Link">org.accordproject.commonmark@0.5.0.Link</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.link"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Link"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.link"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.link"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Link",
  "destination": "string",
  "title": "string",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Link

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Link|
|destination|string|true|none|none|
|title|string|true|none|none|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Image">org.accordproject.commonmark@0.5.0.Image</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.image"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Image"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.image"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.image"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Image",
  "destination": "string",
  "title": "string",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Image

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Image|
|destination|string|true|none|none|
|title|string|true|none|none|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Paragraph">org.accordproject.commonmark@0.5.0.Paragraph</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.paragraph"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Paragraph"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.paragraph"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.paragraph"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Paragraph",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Paragraph

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Paragraph|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.List">org.accordproject.commonmark@0.5.0.List</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.list"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.List"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.list"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.list"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.List",
  "type": "string",
  "start": "string",
  "tight": "string",
  "delimiter": "string",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

List

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.List|
|type|string|true|none|none|
|start|string|false|none|none|
|tight|string|true|none|none|
|delimiter|string|false|none|none|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Item">org.accordproject.commonmark@0.5.0.Item</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.item"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Item"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.item"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.item"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Item",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Item

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Item|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Document">org.accordproject.commonmark@0.5.0.Document</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.document"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Document"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.document"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.document"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Document",
  "xmlns": "string",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Document

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Document|
|xmlns|string|true|none|none|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.Table">org.accordproject.commonmark@0.5.0.Table</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.table"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.Table"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.table"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.table"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Table",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

Table

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.Table|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.TableHead">org.accordproject.commonmark@0.5.0.TableHead</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.tablehead"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.TableHead"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.tablehead"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.tablehead"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.TableHead",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

TableHead

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableHead|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.TableBody">org.accordproject.commonmark@0.5.0.TableBody</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.tablebody"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.TableBody"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.tablebody"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.tablebody"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.TableBody",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

TableBody

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableBody|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.TableRow">org.accordproject.commonmark@0.5.0.TableRow</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.tablerow"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.TableRow"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.tablerow"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.tablerow"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.TableRow",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

TableRow

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableRow|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.HeaderCell">org.accordproject.commonmark@0.5.0.HeaderCell</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.headercell"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.HeaderCell"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.headercell"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.headercell"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.HeaderCell",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

HeaderCell

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.HeaderCell|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_org.accordproject.commonmark@0.5.0.TableCell">org.accordproject.commonmark@0.5.0.TableCell</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.commonmark@0.5.0.tablecell"></a>
<a id="schema_org.accordproject.commonmark@0.5.0.TableCell"></a>
<a id="tocSorg.accordproject.commonmark@0.5.0.tablecell"></a>
<a id="tocsorg.accordproject.commonmark@0.5.0.tablecell"></a>

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.TableCell",
  "text": "string",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark@0.5.0.Node",
      "text": "string",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Node",
          "text": "string",
          "nodes": [],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  ],
  "startLine": 0,
  "endLine": 0
}

```

TableCell

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.commonmark@0.5.0.TableCell|
|text|string|false|none|none|
|nodes|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Root](#schemaorg.accordproject.commonmark@0.5.0.root)|false|none|An instance of org.accordproject.commonmark@0.5.0.Root|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|false|none|An instance of org.accordproject.commonmark@0.5.0.Document|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Child](#schemaorg.accordproject.commonmark@0.5.0.child)|false|none|An instance of org.accordproject.commonmark@0.5.0.Child|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Text](#schemaorg.accordproject.commonmark@0.5.0.text)|false|none|An instance of org.accordproject.commonmark@0.5.0.Text|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.CodeBlock](#schemaorg.accordproject.commonmark@0.5.0.codeblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.CodeBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Code](#schemaorg.accordproject.commonmark@0.5.0.code)|false|none|An instance of org.accordproject.commonmark@0.5.0.Code|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlInline](#schemaorg.accordproject.commonmark@0.5.0.htmlinline)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlInline|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HtmlBlock](#schemaorg.accordproject.commonmark@0.5.0.htmlblock)|false|none|An instance of org.accordproject.commonmark@0.5.0.HtmlBlock|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Emph](#schemaorg.accordproject.commonmark@0.5.0.emph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Emph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Strong](#schemaorg.accordproject.commonmark@0.5.0.strong)|false|none|An instance of org.accordproject.commonmark@0.5.0.Strong|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.BlockQuote](#schemaorg.accordproject.commonmark@0.5.0.blockquote)|false|none|An instance of org.accordproject.commonmark@0.5.0.BlockQuote|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Heading](#schemaorg.accordproject.commonmark@0.5.0.heading)|false|none|An instance of org.accordproject.commonmark@0.5.0.Heading|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.ThematicBreak](#schemaorg.accordproject.commonmark@0.5.0.thematicbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.ThematicBreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Softbreak](#schemaorg.accordproject.commonmark@0.5.0.softbreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Softbreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Linebreak](#schemaorg.accordproject.commonmark@0.5.0.linebreak)|false|none|An instance of org.accordproject.commonmark@0.5.0.Linebreak|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Link](#schemaorg.accordproject.commonmark@0.5.0.link)|false|none|An instance of org.accordproject.commonmark@0.5.0.Link|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Image](#schemaorg.accordproject.commonmark@0.5.0.image)|false|none|An instance of org.accordproject.commonmark@0.5.0.Image|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Paragraph](#schemaorg.accordproject.commonmark@0.5.0.paragraph)|false|none|An instance of org.accordproject.commonmark@0.5.0.Paragraph|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.List](#schemaorg.accordproject.commonmark@0.5.0.list)|false|none|An instance of org.accordproject.commonmark@0.5.0.List|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Item](#schemaorg.accordproject.commonmark@0.5.0.item)|false|none|An instance of org.accordproject.commonmark@0.5.0.Item|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.Table](#schemaorg.accordproject.commonmark@0.5.0.table)|false|none|An instance of org.accordproject.commonmark@0.5.0.Table|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableHead](#schemaorg.accordproject.commonmark@0.5.0.tablehead)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableHead|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableBody](#schemaorg.accordproject.commonmark@0.5.0.tablebody)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableBody|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableRow](#schemaorg.accordproject.commonmark@0.5.0.tablerow)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableRow|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.HeaderCell](#schemaorg.accordproject.commonmark@0.5.0.headercell)|false|none|An instance of org.accordproject.commonmark@0.5.0.HeaderCell|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[org.accordproject.commonmark@0.5.0.TableCell](#schemaorg.accordproject.commonmark@0.5.0.tablecell)|false|none|An instance of org.accordproject.commonmark@0.5.0.TableCell|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.Position">concerto.metamodel@0.4.0.Position</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.position"></a>
<a id="schema_concerto.metamodel@0.4.0.Position"></a>
<a id="tocSconcerto.metamodel@0.4.0.position"></a>
<a id="tocsconcerto.metamodel@0.4.0.position"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Position",
  "line": 0,
  "column": 0,
  "offset": 0
}

```

Position

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Position|
|line|integer|true|none|none|
|column|integer|true|none|none|
|offset|integer|true|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.Range">concerto.metamodel@0.4.0.Range</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.range"></a>
<a id="schema_concerto.metamodel@0.4.0.Range"></a>
<a id="tocSconcerto.metamodel@0.4.0.range"></a>
<a id="tocsconcerto.metamodel@0.4.0.range"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Range",
  "start": {
    "$class": "concerto.metamodel@0.4.0.Position",
    "line": 0,
    "column": 0,
    "offset": 0
  },
  "end": {
    "$class": "concerto.metamodel@0.4.0.Position",
    "line": 0,
    "column": 0,
    "offset": 0
  },
  "source": "string"
}

```

Range

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Range|
|start|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|end|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|source|string|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.TypeIdentifier">concerto.metamodel@0.4.0.TypeIdentifier</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.typeidentifier"></a>
<a id="schema_concerto.metamodel@0.4.0.TypeIdentifier"></a>
<a id="tocSconcerto.metamodel@0.4.0.typeidentifier"></a>
<a id="tocsconcerto.metamodel@0.4.0.typeidentifier"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
  "name": "string",
  "namespace": "string"
}

```

TypeIdentifier

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.TypeIdentifier|
|name|string|true|none|none|
|namespace|string|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.DecoratorLiteral">concerto.metamodel@0.4.0.DecoratorLiteral</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.decoratorliteral"></a>
<a id="schema_concerto.metamodel@0.4.0.DecoratorLiteral"></a>
<a id="tocSconcerto.metamodel@0.4.0.decoratorliteral"></a>
<a id="tocsconcerto.metamodel@0.4.0.decoratorliteral"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

DecoratorLiteral

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorLiteral|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.DecoratorString">concerto.metamodel@0.4.0.DecoratorString</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.decoratorstring"></a>
<a id="schema_concerto.metamodel@0.4.0.DecoratorString"></a>
<a id="tocSconcerto.metamodel@0.4.0.decoratorstring"></a>
<a id="tocsconcerto.metamodel@0.4.0.decoratorstring"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DecoratorString",
  "value": "string",
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

DecoratorString

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorString|
|value|string|true|none|none|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.DecoratorNumber">concerto.metamodel@0.4.0.DecoratorNumber</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.decoratornumber"></a>
<a id="schema_concerto.metamodel@0.4.0.DecoratorNumber"></a>
<a id="tocSconcerto.metamodel@0.4.0.decoratornumber"></a>
<a id="tocsconcerto.metamodel@0.4.0.decoratornumber"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DecoratorNumber",
  "value": 0,
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

DecoratorNumber

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorNumber|
|value|number|true|none|none|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.DecoratorBoolean">concerto.metamodel@0.4.0.DecoratorBoolean</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.decoratorboolean"></a>
<a id="schema_concerto.metamodel@0.4.0.DecoratorBoolean"></a>
<a id="tocSconcerto.metamodel@0.4.0.decoratorboolean"></a>
<a id="tocsconcerto.metamodel@0.4.0.decoratorboolean"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DecoratorBoolean",
  "value": true,
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

DecoratorBoolean

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorBoolean|
|value|boolean|true|none|none|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.DecoratorTypeReference">concerto.metamodel@0.4.0.DecoratorTypeReference</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.decoratortypereference"></a>
<a id="schema_concerto.metamodel@0.4.0.DecoratorTypeReference"></a>
<a id="tocSconcerto.metamodel@0.4.0.decoratortypereference"></a>
<a id="tocsconcerto.metamodel@0.4.0.decoratortypereference"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DecoratorTypeReference",
  "type": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "isArray": false,
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

DecoratorTypeReference

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DecoratorTypeReference|
|type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|isArray|boolean|true|none|none|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.Decorator">concerto.metamodel@0.4.0.Decorator</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.decorator"></a>
<a id="schema_concerto.metamodel@0.4.0.Decorator"></a>
<a id="tocSconcerto.metamodel@0.4.0.decorator"></a>
<a id="tocsconcerto.metamodel@0.4.0.decorator"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Decorator",
  "name": "string",
  "arguments": [
    {
      "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

Decorator

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Decorator|
|name|string|true|none|none|
|arguments|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DecoratorLiteral](#schemaconcerto.metamodel@0.4.0.decoratorliteral)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorLiteral|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DecoratorString](#schemaconcerto.metamodel@0.4.0.decoratorstring)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorString|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DecoratorNumber](#schemaconcerto.metamodel@0.4.0.decoratornumber)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorNumber|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DecoratorBoolean](#schemaconcerto.metamodel@0.4.0.decoratorboolean)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorBoolean|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DecoratorTypeReference](#schemaconcerto.metamodel@0.4.0.decoratortypereference)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorTypeReference|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.Identified">concerto.metamodel@0.4.0.Identified</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.identified"></a>
<a id="schema_concerto.metamodel@0.4.0.Identified"></a>
<a id="tocSconcerto.metamodel@0.4.0.identified"></a>
<a id="tocsconcerto.metamodel@0.4.0.identified"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Identified"
}

```

Identified

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Identified|

<h2 id="tocS_concerto.metamodel@0.4.0.IdentifiedBy">concerto.metamodel@0.4.0.IdentifiedBy</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.identifiedby"></a>
<a id="schema_concerto.metamodel@0.4.0.IdentifiedBy"></a>
<a id="tocSconcerto.metamodel@0.4.0.identifiedby"></a>
<a id="tocsconcerto.metamodel@0.4.0.identifiedby"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.IdentifiedBy",
  "name": "string"
}

```

IdentifiedBy

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IdentifiedBy|
|name|string|true|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.Declaration">concerto.metamodel@0.4.0.Declaration</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.declaration"></a>
<a id="schema_concerto.metamodel@0.4.0.Declaration"></a>
<a id="tocSconcerto.metamodel@0.4.0.declaration"></a>
<a id="tocsconcerto.metamodel@0.4.0.declaration"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Declaration",
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

Declaration

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Declaration|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.EnumDeclaration">concerto.metamodel@0.4.0.EnumDeclaration</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.enumdeclaration"></a>
<a id="schema_concerto.metamodel@0.4.0.EnumDeclaration"></a>
<a id="tocSconcerto.metamodel@0.4.0.enumdeclaration"></a>
<a id="tocsconcerto.metamodel@0.4.0.enumdeclaration"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.EnumDeclaration",
  "properties": [
    {
      "$class": "concerto.metamodel@0.4.0.EnumProperty",
      "name": "string",
      "decorators": [
        {
          "$class": "concerto.metamodel@0.4.0.Decorator",
          "name": "string",
          "arguments": [
            {
              "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

EnumDeclaration

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EnumDeclaration|
|properties|[[concerto.metamodel@0.4.0.EnumProperty](#schemaconcerto.metamodel@0.4.0.enumproperty)]|true|none|[An instance of concerto.metamodel@0.4.0.EnumProperty]|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.EnumProperty">concerto.metamodel@0.4.0.EnumProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.enumproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.EnumProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.enumproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.enumproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.EnumProperty",
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

EnumProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EnumProperty|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.ConceptDeclaration">concerto.metamodel@0.4.0.ConceptDeclaration</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.conceptdeclaration"></a>
<a id="schema_concerto.metamodel@0.4.0.ConceptDeclaration"></a>
<a id="tocSconcerto.metamodel@0.4.0.conceptdeclaration"></a>
<a id="tocsconcerto.metamodel@0.4.0.conceptdeclaration"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
  "isAbstract": false,
  "identified": {
    "$class": "concerto.metamodel@0.4.0.Identified"
  },
  "superType": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "properties": [
    {
      "$class": "concerto.metamodel@0.4.0.Property",
      "name": "string",
      "isArray": false,
      "isOptional": false,
      "decorators": [
        {
          "$class": "concerto.metamodel@0.4.0.Decorator",
          "name": "string",
          "arguments": [
            {
              "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

ConceptDeclaration

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ConceptDeclaration|
|isAbstract|boolean|true|none|none|
|identified|any|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[anyOf]|true|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.AssetDeclaration">concerto.metamodel@0.4.0.AssetDeclaration</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.assetdeclaration"></a>
<a id="schema_concerto.metamodel@0.4.0.AssetDeclaration"></a>
<a id="tocSconcerto.metamodel@0.4.0.assetdeclaration"></a>
<a id="tocsconcerto.metamodel@0.4.0.assetdeclaration"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.AssetDeclaration",
  "isAbstract": false,
  "identified": {
    "$class": "concerto.metamodel@0.4.0.Identified"
  },
  "superType": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "properties": [
    {
      "$class": "concerto.metamodel@0.4.0.Property",
      "name": "string",
      "isArray": false,
      "isOptional": false,
      "decorators": [
        {
          "$class": "concerto.metamodel@0.4.0.Decorator",
          "name": "string",
          "arguments": [
            {
              "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

AssetDeclaration

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.AssetDeclaration|
|isAbstract|boolean|true|none|none|
|identified|any|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[anyOf]|true|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.ParticipantDeclaration">concerto.metamodel@0.4.0.ParticipantDeclaration</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.participantdeclaration"></a>
<a id="schema_concerto.metamodel@0.4.0.ParticipantDeclaration"></a>
<a id="tocSconcerto.metamodel@0.4.0.participantdeclaration"></a>
<a id="tocsconcerto.metamodel@0.4.0.participantdeclaration"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.ParticipantDeclaration",
  "isAbstract": false,
  "identified": {
    "$class": "concerto.metamodel@0.4.0.Identified"
  },
  "superType": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "properties": [
    {
      "$class": "concerto.metamodel@0.4.0.Property",
      "name": "string",
      "isArray": false,
      "isOptional": false,
      "decorators": [
        {
          "$class": "concerto.metamodel@0.4.0.Decorator",
          "name": "string",
          "arguments": [
            {
              "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

ParticipantDeclaration

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ParticipantDeclaration|
|isAbstract|boolean|true|none|none|
|identified|any|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[anyOf]|true|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.TransactionDeclaration">concerto.metamodel@0.4.0.TransactionDeclaration</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.transactiondeclaration"></a>
<a id="schema_concerto.metamodel@0.4.0.TransactionDeclaration"></a>
<a id="tocSconcerto.metamodel@0.4.0.transactiondeclaration"></a>
<a id="tocsconcerto.metamodel@0.4.0.transactiondeclaration"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.TransactionDeclaration",
  "isAbstract": false,
  "identified": {
    "$class": "concerto.metamodel@0.4.0.Identified"
  },
  "superType": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "properties": [
    {
      "$class": "concerto.metamodel@0.4.0.Property",
      "name": "string",
      "isArray": false,
      "isOptional": false,
      "decorators": [
        {
          "$class": "concerto.metamodel@0.4.0.Decorator",
          "name": "string",
          "arguments": [
            {
              "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

TransactionDeclaration

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.TransactionDeclaration|
|isAbstract|boolean|true|none|none|
|identified|any|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[anyOf]|true|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.EventDeclaration">concerto.metamodel@0.4.0.EventDeclaration</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.eventdeclaration"></a>
<a id="schema_concerto.metamodel@0.4.0.EventDeclaration"></a>
<a id="tocSconcerto.metamodel@0.4.0.eventdeclaration"></a>
<a id="tocsconcerto.metamodel@0.4.0.eventdeclaration"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.EventDeclaration",
  "isAbstract": false,
  "identified": {
    "$class": "concerto.metamodel@0.4.0.Identified"
  },
  "superType": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "properties": [
    {
      "$class": "concerto.metamodel@0.4.0.Property",
      "name": "string",
      "isArray": false,
      "isOptional": false,
      "decorators": [
        {
          "$class": "concerto.metamodel@0.4.0.Decorator",
          "name": "string",
          "arguments": [
            {
              "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "name": "string",
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

EventDeclaration

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.EventDeclaration|
|isAbstract|boolean|true|none|none|
|identified|any|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IdentifiedBy](#schemaconcerto.metamodel@0.4.0.identifiedby)|false|none|An instance of concerto.metamodel@0.4.0.IdentifiedBy|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[anyOf]|true|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.RelationshipProperty](#schemaconcerto.metamodel@0.4.0.relationshipproperty)|false|none|An instance of concerto.metamodel@0.4.0.RelationshipProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ObjectProperty](#schemaconcerto.metamodel@0.4.0.objectproperty)|false|none|An instance of concerto.metamodel@0.4.0.ObjectProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.BooleanProperty](#schemaconcerto.metamodel@0.4.0.booleanproperty)|false|none|An instance of concerto.metamodel@0.4.0.BooleanProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DateTimeProperty](#schemaconcerto.metamodel@0.4.0.datetimeproperty)|false|none|An instance of concerto.metamodel@0.4.0.DateTimeProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.StringProperty](#schemaconcerto.metamodel@0.4.0.stringproperty)|false|none|An instance of concerto.metamodel@0.4.0.StringProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.DoubleProperty](#schemaconcerto.metamodel@0.4.0.doubleproperty)|false|none|An instance of concerto.metamodel@0.4.0.DoubleProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.IntegerProperty](#schemaconcerto.metamodel@0.4.0.integerproperty)|false|none|An instance of concerto.metamodel@0.4.0.IntegerProperty|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.LongProperty](#schemaconcerto.metamodel@0.4.0.longproperty)|false|none|An instance of concerto.metamodel@0.4.0.LongProperty|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.Property">concerto.metamodel@0.4.0.Property</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.property"></a>
<a id="schema_concerto.metamodel@0.4.0.Property"></a>
<a id="tocSconcerto.metamodel@0.4.0.property"></a>
<a id="tocsconcerto.metamodel@0.4.0.property"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Property",
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

Property

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Property|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.RelationshipProperty">concerto.metamodel@0.4.0.RelationshipProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.relationshipproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.RelationshipProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.relationshipproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.relationshipproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.RelationshipProperty",
  "type": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

RelationshipProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.RelationshipProperty|
|type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.ObjectProperty">concerto.metamodel@0.4.0.ObjectProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.objectproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.ObjectProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.objectproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.objectproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.ObjectProperty",
  "defaultValue": "string",
  "type": {
    "$class": "concerto.metamodel@0.4.0.TypeIdentifier",
    "name": "string",
    "namespace": "string"
  },
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

ObjectProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ObjectProperty|
|defaultValue|string|false|none|none|
|type|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|true|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.BooleanProperty">concerto.metamodel@0.4.0.BooleanProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.booleanproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.BooleanProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.booleanproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.booleanproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.BooleanProperty",
  "defaultValue": true,
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

BooleanProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.BooleanProperty|
|defaultValue|boolean|false|none|none|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.DateTimeProperty">concerto.metamodel@0.4.0.DateTimeProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.datetimeproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.DateTimeProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.datetimeproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.datetimeproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DateTimeProperty",
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

DateTimeProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DateTimeProperty|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.StringProperty">concerto.metamodel@0.4.0.StringProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.stringproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.StringProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.stringproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.stringproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.StringProperty",
  "defaultValue": "string",
  "validator": {
    "$class": "concerto.metamodel@0.4.0.StringRegexValidator",
    "pattern": "string",
    "flags": "string"
  },
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

StringProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.StringProperty|
|defaultValue|string|false|none|none|
|validator|[concerto.metamodel@0.4.0.StringRegexValidator](#schemaconcerto.metamodel@0.4.0.stringregexvalidator)|false|none|An instance of concerto.metamodel@0.4.0.StringRegexValidator|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.StringRegexValidator">concerto.metamodel@0.4.0.StringRegexValidator</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.stringregexvalidator"></a>
<a id="schema_concerto.metamodel@0.4.0.StringRegexValidator"></a>
<a id="tocSconcerto.metamodel@0.4.0.stringregexvalidator"></a>
<a id="tocsconcerto.metamodel@0.4.0.stringregexvalidator"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.StringRegexValidator",
  "pattern": "string",
  "flags": "string"
}

```

StringRegexValidator

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.StringRegexValidator|
|pattern|string|true|none|none|
|flags|string|true|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.DoubleProperty">concerto.metamodel@0.4.0.DoubleProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.doubleproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.DoubleProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.doubleproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.doubleproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DoubleProperty",
  "defaultValue": 0,
  "validator": {
    "$class": "concerto.metamodel@0.4.0.DoubleDomainValidator",
    "lower": 0,
    "upper": 0
  },
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

DoubleProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DoubleProperty|
|defaultValue|number|false|none|none|
|validator|[concerto.metamodel@0.4.0.DoubleDomainValidator](#schemaconcerto.metamodel@0.4.0.doubledomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.DoubleDomainValidator|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.DoubleDomainValidator">concerto.metamodel@0.4.0.DoubleDomainValidator</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.doubledomainvalidator"></a>
<a id="schema_concerto.metamodel@0.4.0.DoubleDomainValidator"></a>
<a id="tocSconcerto.metamodel@0.4.0.doubledomainvalidator"></a>
<a id="tocsconcerto.metamodel@0.4.0.doubledomainvalidator"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.DoubleDomainValidator",
  "lower": 0,
  "upper": 0
}

```

DoubleDomainValidator

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.DoubleDomainValidator|
|lower|number|false|none|none|
|upper|number|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.IntegerProperty">concerto.metamodel@0.4.0.IntegerProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.integerproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.IntegerProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.integerproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.integerproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.IntegerProperty",
  "defaultValue": 0,
  "validator": {
    "$class": "concerto.metamodel@0.4.0.IntegerDomainValidator",
    "lower": 0,
    "upper": 0
  },
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

IntegerProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IntegerProperty|
|defaultValue|integer|false|none|none|
|validator|[concerto.metamodel@0.4.0.IntegerDomainValidator](#schemaconcerto.metamodel@0.4.0.integerdomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.IntegerDomainValidator|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.IntegerDomainValidator">concerto.metamodel@0.4.0.IntegerDomainValidator</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.integerdomainvalidator"></a>
<a id="schema_concerto.metamodel@0.4.0.IntegerDomainValidator"></a>
<a id="tocSconcerto.metamodel@0.4.0.integerdomainvalidator"></a>
<a id="tocsconcerto.metamodel@0.4.0.integerdomainvalidator"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.IntegerDomainValidator",
  "lower": 0,
  "upper": 0
}

```

IntegerDomainValidator

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.IntegerDomainValidator|
|lower|integer|false|none|none|
|upper|integer|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.LongProperty">concerto.metamodel@0.4.0.LongProperty</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.longproperty"></a>
<a id="schema_concerto.metamodel@0.4.0.LongProperty"></a>
<a id="tocSconcerto.metamodel@0.4.0.longproperty"></a>
<a id="tocsconcerto.metamodel@0.4.0.longproperty"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.LongProperty",
  "defaultValue": 0,
  "validator": {
    "$class": "concerto.metamodel@0.4.0.LongDomainValidator",
    "lower": 0,
    "upper": 0
  },
  "name": "string",
  "isArray": false,
  "isOptional": false,
  "decorators": [
    {
      "$class": "concerto.metamodel@0.4.0.Decorator",
      "name": "string",
      "arguments": [
        {
          "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ],
  "location": {
    "$class": "concerto.metamodel@0.4.0.Range",
    "start": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "end": {
      "$class": "concerto.metamodel@0.4.0.Position",
      "line": 0,
      "column": 0,
      "offset": 0
    },
    "source": "string"
  }
}

```

LongProperty

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.LongProperty|
|defaultValue|integer|false|none|none|
|validator|[concerto.metamodel@0.4.0.LongDomainValidator](#schemaconcerto.metamodel@0.4.0.longdomainvalidator)|false|none|An instance of concerto.metamodel@0.4.0.LongDomainValidator|
|name|string|true|none|none|
|isArray|boolean|true|none|none|
|isOptional|boolean|true|none|none|
|decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|

<h2 id="tocS_concerto.metamodel@0.4.0.LongDomainValidator">concerto.metamodel@0.4.0.LongDomainValidator</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.longdomainvalidator"></a>
<a id="schema_concerto.metamodel@0.4.0.LongDomainValidator"></a>
<a id="tocSconcerto.metamodel@0.4.0.longdomainvalidator"></a>
<a id="tocsconcerto.metamodel@0.4.0.longdomainvalidator"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.LongDomainValidator",
  "lower": 0,
  "upper": 0
}

```

LongDomainValidator

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.LongDomainValidator|
|lower|integer|false|none|none|
|upper|integer|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.Import">concerto.metamodel@0.4.0.Import</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.import"></a>
<a id="schema_concerto.metamodel@0.4.0.Import"></a>
<a id="tocSconcerto.metamodel@0.4.0.import"></a>
<a id="tocsconcerto.metamodel@0.4.0.import"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Import",
  "namespace": "string",
  "uri": "string"
}

```

Import

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Import|
|namespace|string|true|none|none|
|uri|string|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.ImportAll">concerto.metamodel@0.4.0.ImportAll</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.importall"></a>
<a id="schema_concerto.metamodel@0.4.0.ImportAll"></a>
<a id="tocSconcerto.metamodel@0.4.0.importall"></a>
<a id="tocsconcerto.metamodel@0.4.0.importall"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.ImportAll",
  "namespace": "string",
  "uri": "string"
}

```

ImportAll

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ImportAll|
|namespace|string|true|none|none|
|uri|string|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.ImportType">concerto.metamodel@0.4.0.ImportType</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.importtype"></a>
<a id="schema_concerto.metamodel@0.4.0.ImportType"></a>
<a id="tocSconcerto.metamodel@0.4.0.importtype"></a>
<a id="tocsconcerto.metamodel@0.4.0.importtype"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.ImportType",
  "name": "string",
  "namespace": "string",
  "uri": "string"
}

```

ImportType

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.ImportType|
|name|string|true|none|none|
|namespace|string|true|none|none|
|uri|string|false|none|none|

<h2 id="tocS_concerto.metamodel@0.4.0.Model">concerto.metamodel@0.4.0.Model</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.model"></a>
<a id="schema_concerto.metamodel@0.4.0.Model"></a>
<a id="tocSconcerto.metamodel@0.4.0.model"></a>
<a id="tocsconcerto.metamodel@0.4.0.model"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Model",
  "namespace": "string",
  "sourceUri": "string",
  "concertoVersion": "string",
  "imports": [
    {
      "$class": "concerto.metamodel@0.4.0.Import",
      "namespace": "string",
      "uri": "string"
    }
  ],
  "declarations": [
    {
      "$class": "concerto.metamodel@0.4.0.Declaration",
      "name": "string",
      "decorators": [
        {
          "$class": "concerto.metamodel@0.4.0.Decorator",
          "name": "string",
          "arguments": [
            {
              "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ],
      "location": {
        "$class": "concerto.metamodel@0.4.0.Range",
        "start": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "end": {
          "$class": "concerto.metamodel@0.4.0.Position",
          "line": 0,
          "column": 0,
          "offset": 0
        },
        "source": "string"
      }
    }
  ]
}

```

Model

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Model|
|namespace|string|true|none|none|
|sourceUri|string|false|none|none|
|concertoVersion|string|false|none|none|
|imports|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Import](#schemaconcerto.metamodel@0.4.0.import)|false|none|An instance of concerto.metamodel@0.4.0.Import|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ImportAll](#schemaconcerto.metamodel@0.4.0.importall)|false|none|An instance of concerto.metamodel@0.4.0.ImportAll|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ImportType](#schemaconcerto.metamodel@0.4.0.importtype)|false|none|An instance of concerto.metamodel@0.4.0.ImportType|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|declarations|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.Declaration](#schemaconcerto.metamodel@0.4.0.declaration)|false|none|An instance of concerto.metamodel@0.4.0.Declaration|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.EnumDeclaration](#schemaconcerto.metamodel@0.4.0.enumdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.EnumDeclaration|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ConceptDeclaration](#schemaconcerto.metamodel@0.4.0.conceptdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.ConceptDeclaration|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.AssetDeclaration](#schemaconcerto.metamodel@0.4.0.assetdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.AssetDeclaration|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.ParticipantDeclaration](#schemaconcerto.metamodel@0.4.0.participantdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.ParticipantDeclaration|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.TransactionDeclaration](#schemaconcerto.metamodel@0.4.0.transactiondeclaration)|false|none|An instance of concerto.metamodel@0.4.0.TransactionDeclaration|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[concerto.metamodel@0.4.0.EventDeclaration](#schemaconcerto.metamodel@0.4.0.eventdeclaration)|false|none|An instance of concerto.metamodel@0.4.0.EventDeclaration|

<h2 id="tocS_concerto.metamodel@0.4.0.Models">concerto.metamodel@0.4.0.Models</h2>
<!-- backwards compatibility -->
<a id="schemaconcerto.metamodel@0.4.0.models"></a>
<a id="schema_concerto.metamodel@0.4.0.Models"></a>
<a id="tocSconcerto.metamodel@0.4.0.models"></a>
<a id="tocsconcerto.metamodel@0.4.0.models"></a>

```json
{
  "$class": "concerto.metamodel@0.4.0.Models",
  "models": [
    {
      "$class": "concerto.metamodel@0.4.0.Model",
      "namespace": "string",
      "sourceUri": "string",
      "concertoVersion": "string",
      "imports": [
        {
          "$class": "concerto.metamodel@0.4.0.Import",
          "namespace": "string",
          "uri": "string"
        }
      ],
      "declarations": [
        {
          "$class": "concerto.metamodel@0.4.0.Declaration",
          "name": "string",
          "decorators": [
            {
              "$class": "concerto.metamodel@0.4.0.Decorator",
              "name": "string",
              "arguments": [
                {
                  "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                  "location": {
                    "$class": "concerto.metamodel@0.4.0.Range",
                    "start": {},
                    "end": {},
                    "source": "string"
                  }
                }
              ],
              "location": {
                "$class": "concerto.metamodel@0.4.0.Range",
                "start": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "end": {
                  "$class": "concerto.metamodel@0.4.0.Position",
                  "line": 0,
                  "column": 0,
                  "offset": 0
                },
                "source": "string"
              }
            }
          ],
          "location": {
            "$class": "concerto.metamodel@0.4.0.Range",
            "start": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "end": {
              "$class": "concerto.metamodel@0.4.0.Position",
              "line": 0,
              "column": 0,
              "offset": 0
            },
            "source": "string"
          }
        }
      ]
    }
  ]
}

```

Models

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for concerto.metamodel@0.4.0.Models|
|models|[[concerto.metamodel@0.4.0.Model](#schemaconcerto.metamodel@0.4.0.model)]|true|none|[An instance of concerto.metamodel@0.4.0.Model]|

<h2 id="tocS_org.accordproject.party@0.2.0.Party">org.accordproject.party@0.2.0.Party</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.party@0.2.0.party"></a>
<a id="schema_org.accordproject.party@0.2.0.Party"></a>
<a id="tocSorg.accordproject.party@0.2.0.party"></a>
<a id="tocsorg.accordproject.party@0.2.0.party"></a>

```json
{
  "$class": "org.accordproject.party@0.2.0.Party",
  "partyId": "string"
}

```

Party

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for org.accordproject.party@0.2.0.Party|
|partyId|string|true|none|The instance identifier for this type|

