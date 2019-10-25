# `jaeger-browser` <br> ![PyPI](https://img.shields.io/pypi/v/jaeger_browser?style=flat-square) ![npm](https://img.shields.io/npm/v/jaeger-browser?style=flat-square)


This repo is to help you submit Jaeger traces from your browser. It is a workaround
until they implement a browser client.


It contains a Python package that runs a REST API which submits traces locally.

It also contains a TypeScript library that connects to this REST API.


If you want to use this alongside your Jupyter server, check out
[`jupyter-jaeger`](https://github.com/Quansight/jupyter-jaeger). There is an example in that repo of starting a span in a kernel server side and then continueing it on the clien side.

In turn, we use that to instrument [plotting interactive Vega visualizations
with a Python backend](https://github.com/quansight/ibis-vega-transform).

## Limitations

* Doesn't implement full Jaeger API just a subset I needed. PRs welcome.
* Hard coded to connect to a local Jaeger server. PRs welcome.
* No sampling implemented, it will collect all traces. PRs welcome.



## Usage

First get the REST server installed and started:

```bash
# install jaeger-all-in-one
conda -c conda-forge install jaeger

# Install the REST server
pip install jaeger_browser

# Start jaeger all in one
jaeger-all-in-one
# Start the REST server
env PORT=8080 jaeger-browser
```


Then install the client side library and connect to it:

```bash
yarn add jaeger-browser
```

```typescript

import {Client} from 'jaeger-browser';


const client = new Client(new URL('http://localhost:8080/'))



async function doThings(originalExtractedScan: object): Promise<object> {
    // Start a span based on some text-map encoded data
    const span = await client.startSpanExtract({
        name: 'new-span',
        reference: originalExtractedScan,
        relationship: 'child_of'
    });
    // create a new span under it
    const newSpan = await client.startSpan({
        name: 'other-span',
        reference: span,
        relationship: 'child_of'
    })

    // Finish this inner span
    await client.finishSpan(newSpan);

    // return the span we started text-map encoded
    return await client.injectSpan(span);
}
```

