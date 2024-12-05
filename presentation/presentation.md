---
title: "BingoMaker"
author:
- "Derek Allmon"
- "JP Appel"
- "Owen Halliday"
- "Yousuf Kanan"
---

# BingoMaker

<!-- TODO: BingoMaker Branding -->

::: notes
Yousuf

* project description
:::

## Features

* Play bingo
* Create bingo tile pools
* Save bingo cards
* Print bingo cards
* Edit bingo cards
* Share bingo cards

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

# Technologies Not Covered in Class

## UV

::: notes
JP

* pip replacement and project manager
* supports the dependency grouping
    * use to install only what is required for lambdas
    * (segue into lambda layers)
:::


## Lambda Layers

::: notes
JP

* reuse shared dependencies across lambdas
* supports versioning
:::

## Localstack

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
