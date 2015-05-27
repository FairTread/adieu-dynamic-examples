![Adieu.io](http://i.imgur.com/I4Br4c9.png?1)

Adieu.io Dynamic Board Examples
===============================

Example usage of the Adieu.io API to create dynamic boards.

## About Adieu.io

Adieu.io is a service that lets users take back control of the ads they see while 
browsing the web. Adieu.io enables web viewers to see things they want to see inside of ad units
instead of things they don't--namely ads.

Unlike many "ad blocking" extensions, content producers retain their revenue stream from Adieu users. Adieu.io is a *service* that works within (or on top of) the existing advertising ecosystem. You can think of Adieu as extending advertising to add a consumer-customization layer. Adieu consumers directly buy their own ads (automatically, for a fluctuating market rate that is usually a fraction of a penny) and control the content shown within the advertising "boxes".

## Building with the API

Use the API to programmatically create images--called "rads"--which will show up in place of ads for users of the Adieu.io service.

In Adieu, "rads" are associated into collections called "boards", similar to the way that "pins" are added to "pinboards" in Pinterest. 

Boards can public or private, and if boards are private, they may be shared individually with other users. In turn, rads may be added to boards.

## Simple and Dynamic Boards

A simple board is one in which the user directly uploads pictures or templates via the [Adieu.io](https://www.adieu.io/) web interface. 

A dynamic board can have its contents edited by an external program. You might run this external program on your own computer, or on a server somewhere. Dynamic boards upload rads periodically, as they require. A board can contain up to 20 individual rads.

## API Tokens

Each board has its own API token. The token is associated with an individual board, and grants complete control over the board. Consequently, tokens should be kept private.

You may retrieve tokens by logging into [adieu.io](https://www.adieu.io/) and navigating to Boards->Upload->API.

### Installation

In the project root, install any required moduels:

```bash

npm install .

```

#### Export a Token

You'll need a board token setup to use these examples.

```

 % export ADIEU_BOARD_TOKEN=YOURTOKENHERE


```

### Running the Examples

Adieu lets To see how to use the Adieu Api, have a look at the example directory. For instance, this imports user 2682274 (@mankins)'s photos into a board.

```

 % cd examples
 % node instragram 2682274


```


### Uploading a single PNG vs a Templated PNG

Ad units come in multiple different sizes, and so to exert the greatest design control, you'll want to fill out the Adieu template with custom created and cropped images. Adieu expects certain ad units to be at the pixel coordinates listed in the template in the docs directory of the repository.

For simpler applications, a single PNG may be uploaded as well that will be cropped and resized for each ad size, as required. While this method is simpler, some image dimensions may not translate well across all ad sizes. 


## For more help

For more help, write us at either @adieuio or hello@adieu.io.
