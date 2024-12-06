---
title: "BingoMaker"
author:
- "Derek Allmon"
- "JP Appel"
- "Owen Halliday"
- "Yousuf Kanan"
---

# Features

<!-- TODO: BingoMaker Branding -->

::: incremental

* Play bingo
* Create bingo tile pools
* Save bingo cards
* Print bingo cards
* Edit bingo cards
* Share bingo cards

:::

::: notes
Yousuf

:::

# System Architecture

## Monolithic

::: notes
Yousuf
:::

## Distributed

::: notes
Yousuf

:::

# Demo

**QRCODE**

::: notes
Derek

:::

# New Technologies

## UV

![](uv_logo.svg){ width=200px }

::: notes
JP

* pip replacement and project manager
* similar to npm and npx
* supports the dependency grouping
    * use to install only what is required for lambdas
    * (segue into lambda layers)
:::


## Lambda Layers

. . .

![](https://docs.aws.amazon.com/images/lambda/latest/dg/images/lambda-layers-diagram.png){ height=565px }

::: notes
JP

* reuse shared dependencies across lambdas
* supports versioning
:::

## 

<div class="columns" style="align-items: center;">
::::: {.column width=45%}
![](local_stack.png)
:::::
::::: {.column width=5%}
<b>+</b>
::::
::::: {.column width=45%}
![](https://logos-world.net/wp-content/uploads/2021/02/Docker-Logo.png)
:::::
</div>

::: notes
JP

* locally run some aws service
* does not support all aws services
    * some require a premium subscriptions
    * (segue into terraform)
:::

## Terraform

::: notes
Owen

<!-- JP: this slide should be fairly light, it should be what is terraform not how we use it -->
<!-- JP: the how we use terraform comes in the next section -->

* cloud orchestration, similar to cloudformation
* allows us to almost have single `up`/`down` commands
    * amplify issue
<!-- JP: might want to place amplify issue in the automation section -->

:::

# Automation/Scripting

## Makefiles

. . .

```makefile
lint:
    uv run ruff check

test:
    uv run pytest

remote-deploy: deploy/.terraform
    terraform -chdir=deploy apply -auto-approve

deploy/.terraform:
    terraform -chdir=deploy init
```

::: notes
JP

* used a makefile to simplify
    * zipping lambda layers
    * local testing
    * local linting
* also had targets for
    * remote distributed deploy
    * remote distributed destroy using terraform
    * local monolithic deploy
:::

## GitHub Actions

<!-- TODO: github logo, green checkmark :) -->

::: notes
Owen

* automatic linting and testing
* performed on a push
* in the future could be used to automate deployment
:::

## Automation Terraform

::: notes
Owen

* need to set env vars
* makes dep tree so services are started in corrected order
:::


# Lessons Learned

::: incremental

* collaboration
* read documentation
* no, don't have ChatGPT read it **READ THE DOCS**

:::

::: notes
Everyone
<!-- JP: I think it's best if we all list at least one take away -->

* Group: integrate changes fast and often
* JP: **READ THE OFFICIAL DOCS, NOT STACK OVERFLOW**
    * localstack issue
    * boto3 client issue
* Derek: working while waiting for changes
* Yousuf: Lab permissions
    * documentdb
* Owen: communicating the status of changes
:::

# Future Work

::: incremental

* Cognito
* Images in tiles

:::

::: notes
Yousuf

* Cognito
* Images
:::
