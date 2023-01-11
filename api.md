---
title: Generated Open API from Concerto Models v1.0.0
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

<h1 id="generated-open-api-from-concerto-models">Generated Open API from Concerto Models v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Base URLs:

<h1 id="generated-open-api-from-concerto-models-default">Default</h1>

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
    "name": "string",
    "author": "string",
    "displayName": "string",
    "version": "string",
    "description": "string",
    "license": "string",
    "keywords": [
      "string"
    ],
    "logo": {
      "$class": "org.accordproject.protocol@1.0.0.Logo",
      "base64": "string",
      "mimeType": "string"
    },
    "model": {
      "$class": "org.accordproject.protocol@1.0.0.Model",
      "value": {
        "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
        "isAbstract": true,
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
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
              {}
            ],
            "startLine": 0,
            "endLine": 0
          }
        ],
        "startLine": 0,
        "endLine": 0
      }
    },
    "logic": {
      "$class": "org.accordproject.protocol@1.0.0.Logic",
      "functions": [
        {
          "$class": "org.accordproject.protocol@1.0.0.Function",
          "name": "string",
          "inputs": [
            {
              "$class": "concerto.metamodel@0.4.0.Property",
              "name": "string",
              "isArray": true,
              "isOptional": true,
              "decorators": [
                {
                  "$class": "concerto.metamodel@0.4.0.Decorator",
                  "name": "string",
                  "arguments": [
                    {}
                  ],
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
          "output": {
            "$class": "concerto.metamodel@0.4.0.Property",
            "name": "string",
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
          },
          "code": "string"
        }
      ]
    }
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
|»» $class|string|true|none|The class identifier for this type|
|»» name|string|true|none|The instance identifier for this type|
|»» author|string|true|none|none|
|»» displayName|string|false|none|none|
|»» version|string|true|none|none|
|»» description|string|false|none|none|
|»» license|string|true|none|none|
|»» keywords|[string]|false|none|none|
|»» logo|[org.accordproject.protocol@1.0.0.Logo](#schemaorg.accordproject.protocol@1.0.0.logo)|false|none|An instance of org.accordproject.protocol@1.0.0.Logo|
|»»» $class|string|true|none|The class identifier for this type|
|»»» base64|string|true|none|none|
|»»» mimeType|string|true|none|none|
|»» model|[org.accordproject.protocol@1.0.0.Model](#schemaorg.accordproject.protocol@1.0.0.model)|true|none|An instance of org.accordproject.protocol@1.0.0.Model|
|»»» $class|string|true|none|The class identifier for this type|
|»»» value|[concerto.metamodel@0.4.0.ConceptDeclaration](#schemaconcerto.metamodel@0.4.0.conceptdeclaration)|true|none|An instance of concerto.metamodel@0.4.0.ConceptDeclaration|
|»»»» $class|string|true|none|The class identifier for this type|
|»»»» isAbstract|boolean|true|none|none|
|»»»» identified|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|»»»»» $class|string|true|none|The class identifier for this type|
|»»»» superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|»»»»» $class|string|true|none|The class identifier for this type|
|»»»»» name|string|true|none|none|
|»»»»» namespace|string|false|none|none|
|»»»» properties|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
|»»»»» Property|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|
|»»»»»» $class|string|true|none|The class identifier for this type|
|»»»»»» name|string|true|none|none|
|»»»»»» isArray|boolean|true|none|none|
|»»»»»» isOptional|boolean|true|none|none|
|»»»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»»»»»» $class|string|true|none|The class identifier for this type|
|»»»»»»»» name|string|true|none|none|
|»»»»»»»» arguments|[[concerto.metamodel@0.4.0.DecoratorLiteral](#schemaconcerto.metamodel@0.4.0.decoratorliteral)]|false|none|[An instance of concerto.metamodel@0.4.0.DecoratorLiteral]|
|»»»»»»»»» DecoratorLiteral|[concerto.metamodel@0.4.0.DecoratorLiteral](#schemaconcerto.metamodel@0.4.0.decoratorliteral)|false|none|An instance of concerto.metamodel@0.4.0.DecoratorLiteral|
|»»»»»»»»»» $class|string|true|none|The class identifier for this type|
|»»»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»»»»»»» $class|string|true|none|The class identifier for this type|
|»»»»»»»»»»» start|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»»» $class|string|true|none|The class identifier for this type|
|»»»»»»»»»»»» line|integer|true|none|none|
|»»»»»»»»»»»» column|integer|true|none|none|
|»»»»»»»»»»»» offset|integer|true|none|none|
|»»»»»»»»»»» end|[concerto.metamodel@0.4.0.Position](#schemaconcerto.metamodel@0.4.0.position)|true|none|An instance of concerto.metamodel@0.4.0.Position|
|»»»»»»»»»»» source|string|false|none|none|
|»»»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»»»» name|string|true|none|none|
|»»»» decorators|[[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)]|false|none|[An instance of concerto.metamodel@0.4.0.Decorator]|
|»»»»» Decorator|[concerto.metamodel@0.4.0.Decorator](#schemaconcerto.metamodel@0.4.0.decorator)|false|none|An instance of concerto.metamodel@0.4.0.Decorator|
|»»»» location|[concerto.metamodel@0.4.0.Range](#schemaconcerto.metamodel@0.4.0.range)|false|none|An instance of concerto.metamodel@0.4.0.Range|
|»» text|[org.accordproject.protocol@1.0.0.Text](#schemaorg.accordproject.protocol@1.0.0.text)|true|none|An instance of org.accordproject.protocol@1.0.0.Text|
|»»» $class|string|true|none|The class identifier for this type|
|»»» templateMark|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|true|none|An instance of org.accordproject.commonmark@0.5.0.Document|
|»»»» $class|string|true|none|The class identifier for this type|
|»»»» xmlns|string|true|none|none|
|»»»» text|string|false|none|none|
|»»»» nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
|»»»»» Node|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|
|»»»»»» $class|string|true|none|The class identifier for this type|
|»»»»»» text|string|false|none|none|
|»»»»»» nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|
|»»»»»»» Node|[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)|false|none|An instance of org.accordproject.commonmark@0.5.0.Node|
|»»»»»» startLine|integer|false|none|none|
|»»»»»» endLine|integer|false|none|none|
|»»»» startLine|integer|false|none|none|
|»»»» endLine|integer|false|none|none|
|»» logic|[org.accordproject.protocol@1.0.0.Logic](#schemaorg.accordproject.protocol@1.0.0.logic)|false|none|An instance of org.accordproject.protocol@1.0.0.Logic|
|»»» $class|string|true|none|The class identifier for this type|
|»»» functions|[[org.accordproject.protocol@1.0.0.Function](#schemaorg.accordproject.protocol@1.0.0.function)]|true|none|[An instance of org.accordproject.protocol@1.0.0.Function]|
|»»»» Function|[org.accordproject.protocol@1.0.0.Function](#schemaorg.accordproject.protocol@1.0.0.function)|false|none|An instance of org.accordproject.protocol@1.0.0.Function|
|»»»»» $class|string|true|none|The class identifier for this type|
|»»»»» name|string|true|none|The instance identifier for this type|
|»»»»» inputs|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
|»»»»»» Property|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|
|»»»»» output|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|
|»»»»» code|string|true|none|none|

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
  "name": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Logo",
    "base64": "string",
    "mimeType": "string"
  },
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.Model",
    "value": {
      "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
      "isAbstract": true,
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
          "isArray": true,
          "isOptional": true,
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
            {}
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "functions": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Function",
        "name": "string",
        "inputs": [
          {
            "$class": "concerto.metamodel@0.4.0.Property",
            "name": "string",
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
        "output": {
          "$class": "concerto.metamodel@0.4.0.Property",
          "name": "string",
          "isArray": true,
          "isOptional": true,
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
        },
        "code": "string"
      }
    ]
  }
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
  "name": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Logo",
    "base64": "string",
    "mimeType": "string"
  },
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.Model",
    "value": {
      "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
      "isAbstract": true,
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
          "isArray": true,
          "isOptional": true,
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
            {}
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "functions": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Function",
        "name": "string",
        "inputs": [
          {
            "$class": "concerto.metamodel@0.4.0.Property",
            "name": "string",
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
        "output": {
          "$class": "concerto.metamodel@0.4.0.Property",
          "name": "string",
          "isArray": true,
          "isOptional": true,
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
        },
        "code": "string"
      }
    ]
  }
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
curl -X GET /templates/{name} \
  -H 'Accept: application/json'

```

```http
GET /templates/{name} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/templates/{name}',
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

result = RestClient.get '/templates/{name}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/templates/{name}', headers = headers)

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
    $response = $client->request('GET','/templates/{name}', array(
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
URL obj = new URL("/templates/{name}");
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
    req, err := http.NewRequest("GET", "/templates/{name}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /templates/{name}`

*Get a template*

Gets the details of a single instance of a `template`.

<h3 id="gettemplate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|name|path|string|true|A unique identifier for a `Template`.|

> Example responses

> 200 Response

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "name": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Logo",
    "base64": "string",
    "mimeType": "string"
  },
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.Model",
    "value": {
      "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
      "isAbstract": true,
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
          "isArray": true,
          "isOptional": true,
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
            {}
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "functions": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Function",
        "name": "string",
        "inputs": [
          {
            "$class": "concerto.metamodel@0.4.0.Property",
            "name": "string",
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
        "output": {
          "$class": "concerto.metamodel@0.4.0.Property",
          "name": "string",
          "isArray": true,
          "isOptional": true,
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
        },
        "code": "string"
      }
    ]
  }
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
curl -X PUT /templates/{name} \
  -H 'Content-Type: application/json'

```

```http
PUT /templates/{name} HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "name": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Logo",
    "base64": "string",
    "mimeType": "string"
  },
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.Model",
    "value": {
      "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
      "isAbstract": true,
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
          "isArray": true,
          "isOptional": true,
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
            {}
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "functions": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Function",
        "name": "string",
        "inputs": [
          {
            "$class": "concerto.metamodel@0.4.0.Property",
            "name": "string",
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
        "output": {
          "$class": "concerto.metamodel@0.4.0.Property",
          "name": "string",
          "isArray": true,
          "isOptional": true,
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
        },
        "code": "string"
      }
    ]
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/templates/{name}',
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

result = RestClient.put '/templates/{name}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('/templates/{name}', headers = headers)

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
    $response = $client->request('PUT','/templates/{name}', array(
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
URL obj = new URL("/templates/{name}");
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
    req, err := http.NewRequest("PUT", "/templates/{name}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /templates/{name}`

*Update a template*

Updates an existing `template`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "name": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Logo",
    "base64": "string",
    "mimeType": "string"
  },
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.Model",
    "value": {
      "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
      "isAbstract": true,
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
          "isArray": true,
          "isOptional": true,
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
            {}
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "functions": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Function",
        "name": "string",
        "inputs": [
          {
            "$class": "concerto.metamodel@0.4.0.Property",
            "name": "string",
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
        "output": {
          "$class": "concerto.metamodel@0.4.0.Property",
          "name": "string",
          "isArray": true,
          "isOptional": true,
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
        },
        "code": "string"
      }
    ]
  }
}
```

<h3 id="replacetemplate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.Template](#schemaorg.accordproject.protocol@1.0.0.template)|true|Updated `template` information.|
|name|path|string|true|A unique identifier for a `Template`.|

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
curl -X DELETE /templates/{name}

```

```http
DELETE /templates/{name} HTTP/1.1

```

```javascript

fetch('/templates/{name}',
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

result = RestClient.delete '/templates/{name}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('/templates/{name}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/templates/{name}', array(
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
URL obj = new URL("/templates/{name}");
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
    req, err := http.NewRequest("DELETE", "/templates/{name}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /templates/{name}`

*Delete a template*

Deletes an existing `template`.

<h3 id="deletetemplate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|name|path|string|true|A unique identifier for a `Template`.|

<h3 id="deletetemplate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

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
    "agreementId": "string",
    "data": "string",
    "template": "string"
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
|»» $class|string|true|none|The class identifier for this type|
|»» agreementId|string|true|none|The instance identifier for this type|
|»» data|string|true|none|none|
|»» template|string|true|none|The identifier of an instance of org.accordproject.protocol@1.0.0.Template|

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
  "agreementId": "string",
  "data": "string",
  "template": "string"
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
  "agreementId": "string",
  "data": "string",
  "template": "string"
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
curl -X GET /agreements/{agreementId} \
  -H 'Accept: application/json'

```

```http
GET /agreements/{agreementId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/agreements/{agreementId}',
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

result = RestClient.get '/agreements/{agreementId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/agreements/{agreementId}', headers = headers)

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
    $response = $client->request('GET','/agreements/{agreementId}', array(
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
URL obj = new URL("/agreements/{agreementId}");
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
    req, err := http.NewRequest("GET", "/agreements/{agreementId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /agreements/{agreementId}`

*Get a agreement*

Gets the details of a single instance of a `agreement`.

<h3 id="getagreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|agreementId|path|string|true|A unique identifier for a `Agreement`.|

> Example responses

> 200 Response

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "agreementId": "string",
  "data": "string",
  "template": "string"
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
curl -X PUT /agreements/{agreementId} \
  -H 'Content-Type: application/json'

```

```http
PUT /agreements/{agreementId} HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "agreementId": "string",
  "data": "string",
  "template": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/agreements/{agreementId}',
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

result = RestClient.put '/agreements/{agreementId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('/agreements/{agreementId}', headers = headers)

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
    $response = $client->request('PUT','/agreements/{agreementId}', array(
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
URL obj = new URL("/agreements/{agreementId}");
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
    req, err := http.NewRequest("PUT", "/agreements/{agreementId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /agreements/{agreementId}`

*Update a agreement*

Updates an existing `agreement`.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "agreementId": "string",
  "data": "string",
  "template": "string"
}
```

<h3 id="replaceagreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.Agreement](#schemaorg.accordproject.protocol@1.0.0.agreement)|true|Updated `agreement` information.|
|agreementId|path|string|true|A unique identifier for a `Agreement`.|

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
curl -X DELETE /agreements/{agreementId}

```

```http
DELETE /agreements/{agreementId} HTTP/1.1

```

```javascript

fetch('/agreements/{agreementId}',
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

result = RestClient.delete '/agreements/{agreementId}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('/agreements/{agreementId}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/agreements/{agreementId}', array(
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
URL obj = new URL("/agreements/{agreementId}");
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
    req, err := http.NewRequest("DELETE", "/agreements/{agreementId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /agreements/{agreementId}`

*Delete a agreement*

Deletes an existing `agreement`.

<h3 id="deleteagreement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|agreementId|path|string|true|A unique identifier for a `Agreement`.|

<h3 id="deleteagreement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

## convertAgreementPdf

<a id="opIdconvertAgreementPdf"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /agreements/{agreementId}/convert/pdf \
  -H 'Content-Type: application/json'

```

```http
POST /agreements/{agreementId}/convert/pdf HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "$class": "org.accordproject.protocol@1.0.0.PdfConversionOptions",
  "styles": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/agreements/{agreementId}/convert/pdf',
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

result = RestClient.post '/agreements/{agreementId}/convert/pdf',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/agreements/{agreementId}/convert/pdf', headers = headers)

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
    $response = $client->request('POST','/agreements/{agreementId}/convert/pdf', array(
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
URL obj = new URL("/agreements/{agreementId}/convert/pdf");
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
    req, err := http.NewRequest("POST", "/agreements/{agreementId}/convert/pdf", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /agreements/{agreementId}/convert/pdf`

*Convert agreement to PDF*

Converts an existing `agreement` to PDF.

> Body parameter

```json
{
  "$class": "org.accordproject.protocol@1.0.0.PdfConversionOptions",
  "styles": "string"
}
```

<h3 id="convertagreementpdf-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[org.accordproject.protocol@1.0.0.PdfConversionOptions](#schemaorg.accordproject.protocol@1.0.0.pdfconversionoptions)|true|PDF conversion options.|
|agreementId|path|string|true|A unique identifier for a `Agreement`.|

<h3 id="convertagreementpdf-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|Successful response.|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_org.accordproject.protocol@1.0.0.Logo">org.accordproject.protocol@1.0.0.Logo</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.logo"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Logo"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.logo"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.logo"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Logo",
  "base64": "string",
  "mimeType": "string"
}

```

Logo

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
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
          {}
        ],
        "startLine": 0,
        "endLine": 0
      }
    ],
    "startLine": 0,
    "endLine": 0
  }
}

```

Text

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
|templateMark|[org.accordproject.commonmark@0.5.0.Document](#schemaorg.accordproject.commonmark@0.5.0.document)|true|none|An instance of org.accordproject.commonmark@0.5.0.Document|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Model">org.accordproject.protocol@1.0.0.Model</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.model"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Model"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.model"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.model"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Model",
  "value": {
    "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
    "isAbstract": true,
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
        "isArray": true,
        "isOptional": true,
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
}

```

Model

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
|value|[concerto.metamodel@0.4.0.ConceptDeclaration](#schemaconcerto.metamodel@0.4.0.conceptdeclaration)|true|none|An instance of concerto.metamodel@0.4.0.ConceptDeclaration|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Function">org.accordproject.protocol@1.0.0.Function</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.function"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Function"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.function"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.function"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Function",
  "name": "string",
  "inputs": [
    {
      "$class": "concerto.metamodel@0.4.0.Property",
      "name": "string",
      "isArray": true,
      "isOptional": true,
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
  "output": {
    "$class": "concerto.metamodel@0.4.0.Property",
    "name": "string",
    "isArray": true,
    "isOptional": true,
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
  },
  "code": "string"
}

```

Function

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
|name|string|true|none|The instance identifier for this type|
|inputs|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
|output|[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)|false|none|An instance of concerto.metamodel@0.4.0.Property|
|code|string|true|none|none|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Logic">org.accordproject.protocol@1.0.0.Logic</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.logic"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Logic"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.logic"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.logic"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Logic",
  "functions": [
    {
      "$class": "org.accordproject.protocol@1.0.0.Function",
      "name": "string",
      "inputs": [
        {
          "$class": "concerto.metamodel@0.4.0.Property",
          "name": "string",
          "isArray": true,
          "isOptional": true,
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
      ],
      "output": {
        "$class": "concerto.metamodel@0.4.0.Property",
        "name": "string",
        "isArray": true,
        "isOptional": true,
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
      },
      "code": "string"
    }
  ]
}

```

Logic

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
|functions|[[org.accordproject.protocol@1.0.0.Function](#schemaorg.accordproject.protocol@1.0.0.function)]|true|none|[An instance of org.accordproject.protocol@1.0.0.Function]|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Template">org.accordproject.protocol@1.0.0.Template</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.template"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Template"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.template"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.template"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Template",
  "name": "string",
  "author": "string",
  "displayName": "string",
  "version": "string",
  "description": "string",
  "license": "string",
  "keywords": [
    "string"
  ],
  "logo": {
    "$class": "org.accordproject.protocol@1.0.0.Logo",
    "base64": "string",
    "mimeType": "string"
  },
  "model": {
    "$class": "org.accordproject.protocol@1.0.0.Model",
    "value": {
      "$class": "concerto.metamodel@0.4.0.ConceptDeclaration",
      "isAbstract": true,
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
          "isArray": true,
          "isOptional": true,
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
            {}
          ],
          "startLine": 0,
          "endLine": 0
        }
      ],
      "startLine": 0,
      "endLine": 0
    }
  },
  "logic": {
    "$class": "org.accordproject.protocol@1.0.0.Logic",
    "functions": [
      {
        "$class": "org.accordproject.protocol@1.0.0.Function",
        "name": "string",
        "inputs": [
          {
            "$class": "concerto.metamodel@0.4.0.Property",
            "name": "string",
            "isArray": true,
            "isOptional": true,
            "decorators": [
              {
                "$class": "concerto.metamodel@0.4.0.Decorator",
                "name": "string",
                "arguments": [
                  {
                    "$class": "concerto.metamodel@0.4.0.DecoratorLiteral",
                    "location": {}
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
        "output": {
          "$class": "concerto.metamodel@0.4.0.Property",
          "name": "string",
          "isArray": true,
          "isOptional": true,
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
        },
        "code": "string"
      }
    ]
  }
}

```

Template

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
|name|string|true|none|The instance identifier for this type|
|author|string|true|none|none|
|displayName|string|false|none|none|
|version|string|true|none|none|
|description|string|false|none|none|
|license|string|true|none|none|
|keywords|[string]|false|none|none|
|logo|[org.accordproject.protocol@1.0.0.Logo](#schemaorg.accordproject.protocol@1.0.0.logo)|false|none|An instance of org.accordproject.protocol@1.0.0.Logo|
|model|[org.accordproject.protocol@1.0.0.Model](#schemaorg.accordproject.protocol@1.0.0.model)|true|none|An instance of org.accordproject.protocol@1.0.0.Model|
|text|[org.accordproject.protocol@1.0.0.Text](#schemaorg.accordproject.protocol@1.0.0.text)|true|none|An instance of org.accordproject.protocol@1.0.0.Text|
|logic|[org.accordproject.protocol@1.0.0.Logic](#schemaorg.accordproject.protocol@1.0.0.logic)|false|none|An instance of org.accordproject.protocol@1.0.0.Logic|

<h2 id="tocS_org.accordproject.protocol@1.0.0.Agreement">org.accordproject.protocol@1.0.0.Agreement</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.agreement"></a>
<a id="schema_org.accordproject.protocol@1.0.0.Agreement"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.agreement"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.agreement"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.Agreement",
  "agreementId": "string",
  "data": "string",
  "template": "string"
}

```

Agreement

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
|agreementId|string|true|none|The instance identifier for this type|
|data|string|true|none|none|
|template|string|true|none|The identifier of an instance of org.accordproject.protocol@1.0.0.Template|

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
|$class|string|true|none|The class identifier for this type|

<h2 id="tocS_org.accordproject.protocol@1.0.0.PdfConversionOptions">org.accordproject.protocol@1.0.0.PdfConversionOptions</h2>
<!-- backwards compatibility -->
<a id="schemaorg.accordproject.protocol@1.0.0.pdfconversionoptions"></a>
<a id="schema_org.accordproject.protocol@1.0.0.PdfConversionOptions"></a>
<a id="tocSorg.accordproject.protocol@1.0.0.pdfconversionoptions"></a>
<a id="tocsorg.accordproject.protocol@1.0.0.pdfconversionoptions"></a>

```json
{
  "$class": "org.accordproject.protocol@1.0.0.PdfConversionOptions",
  "styles": "string"
}

```

PdfConversionOptions

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|$class|string|true|none|The class identifier for this type|
|styles|string|false|none|none|

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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
|name|string|true|none|none|
|arguments|[[concerto.metamodel@0.4.0.DecoratorLiteral](#schemaconcerto.metamodel@0.4.0.decoratorliteral)]|false|none|[An instance of concerto.metamodel@0.4.0.DecoratorLiteral]|
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
|$class|string|true|none|The class identifier for this type|

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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
  "isAbstract": true,
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
      "isArray": true,
      "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
|isAbstract|boolean|true|none|none|
|identified|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
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
  "isAbstract": true,
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
      "isArray": true,
      "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
|isAbstract|boolean|true|none|none|
|identified|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
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
  "isAbstract": true,
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
      "isArray": true,
      "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
|isAbstract|boolean|true|none|none|
|identified|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
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
  "isAbstract": true,
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
      "isArray": true,
      "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
|isAbstract|boolean|true|none|none|
|identified|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
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
  "isAbstract": true,
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
      "isArray": true,
      "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
|isAbstract|boolean|true|none|none|
|identified|[concerto.metamodel@0.4.0.Identified](#schemaconcerto.metamodel@0.4.0.identified)|false|none|An instance of concerto.metamodel@0.4.0.Identified|
|superType|[concerto.metamodel@0.4.0.TypeIdentifier](#schemaconcerto.metamodel@0.4.0.typeidentifier)|false|none|An instance of concerto.metamodel@0.4.0.TypeIdentifier|
|properties|[[concerto.metamodel@0.4.0.Property](#schemaconcerto.metamodel@0.4.0.property)]|true|none|[An instance of concerto.metamodel@0.4.0.Property]|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
  "isArray": true,
  "isOptional": true,
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
|namespace|string|true|none|none|
|sourceUri|string|false|none|none|
|concertoVersion|string|false|none|none|
|imports|[[concerto.metamodel@0.4.0.Import](#schemaconcerto.metamodel@0.4.0.import)]|false|none|[An instance of concerto.metamodel@0.4.0.Import]|
|declarations|[[concerto.metamodel@0.4.0.Declaration](#schemaconcerto.metamodel@0.4.0.declaration)]|false|none|[An instance of concerto.metamodel@0.4.0.Declaration]|

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
|$class|string|true|none|The class identifier for this type|
|models|[[concerto.metamodel@0.4.0.Model](#schemaconcerto.metamodel@0.4.0.model)]|true|none|[An instance of concerto.metamodel@0.4.0.Model]|

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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
|$class|string|true|none|The class identifier for this type|
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
|$class|string|true|none|The class identifier for this type|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|info|string|false|none|none|
|tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|info|string|false|none|none|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|tag|[org.accordproject.commonmark@0.5.0.TagInfo](#schemaorg.accordproject.commonmark@0.5.0.taginfo)|false|none|An instance of org.accordproject.commonmark@0.5.0.TagInfo|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|level|string|true|none|none|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|destination|string|true|none|none|
|title|string|true|none|none|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|destination|string|true|none|none|
|title|string|true|none|none|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|type|string|true|none|none|
|start|string|false|none|none|
|tight|string|true|none|none|
|delimiter|string|false|none|none|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|xmlns|string|true|none|none|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
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
        {}
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
|$class|string|true|none|The class identifier for this type|
|text|string|false|none|none|
|nodes|[[org.accordproject.commonmark@0.5.0.Node](#schemaorg.accordproject.commonmark@0.5.0.node)]|false|none|[An instance of org.accordproject.commonmark@0.5.0.Node]|
|startLine|integer|false|none|none|
|endLine|integer|false|none|none|

