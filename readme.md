# TermKit

![TermKit Icon](https://github.com/unconed/TermKit/raw/master/Illustrator/TermKit%20Icon%20128.png)

### Goal: next gen terminal / command application

Built out of WebKit and Node.js.

Runs as a desktop app on Mac, Windows and Linux, and can be hacked into any WebKit browser (Chrome, Safari).

[Follow TermKit on Twitter](https://twitter.com/TermKit) for the latest news and updates.

For the background and architecture, please read and comment on:
http://acko.net/blog/on-termkit

![TermKit 0.3 alpha](https://github.com/unconed/TermKit/raw/master/Mockups/Shot-0.3.png)
![TermKit 0.3 alpha](https://github.com/unconed/TermKit/raw/master/Mockups/Shot-Self-Commit.png)
![TermKit 0.3 alpha](https://github.com/unconed/TermKit/raw/master/Mockups/Shot-Highlight.png)

### Warning: Alpha version, still under development. Nothing works yet.

## Some cool features

* Smart token-based input with inline autocomplete and automatic escaping
* Rich output for common tasks and formats, using MIME types + sniffing
* Asynchronous views for background / parallel tasks
* Full separation between front/back-end

## TermKit is not a...
* ...Web application. It runs as a regular desktop app.
* ...Scripting language like PowerShell or bash. It focuses on executing commands only.
* ...Full terminal emulator. It does not aim to e.g. host 'vim'.
* ...Reimplementation of the Unix toolchain. It replaces and/or enhances built-in commands and wraps external tools.

(but you could make it do most of those things with plug-ins)

## How to use:

Detailed instructions are available from these sources:

* [Mac OS X (OS X Daily)](http://osxdaily.com/2011/05/19/termkit-terminal-reimagined-how-to-install/)
* [Windows (Redpoint blog)](http://blog.redpointsoftware.com.au/termkit/)
* [Linux, Python GTK](https://github.com/unconed/TermKit/tree/master/Linux)
* [Linux, Chrome only (Easytech blog)](http://blog.easytech.com.ar/2011/05/21/playing-with-termkit-with-chrome/)

Unfortunately, TermKit currently requires some assembly.

1. Install the Mac development tools (Xcode and friends).
2. [Install node.js](https://github.com/joyent/node/wiki/Installation).
3. If not covered in #2, install npm: `curl http://npmjs.org/install.sh | sh`
4. Install node-mime: `npm install mime`
5. Clone the TermKit repository: `git clone https://github.com/unconed/TermKit.git --recursive`
6. Users of older git versions will need to type: `git submodule update --init`
7. Run the NodeKit daemon: `cd TermKit/Node; node nodekit.js`

Mac:
* Unzip and run the Mac app in Build/TermKit.zip

Linux:
* See Linux/Readme.txt

*Tip:* Press ⌥⌘C to access the WebKit console.

## API

Preliminary instructions on how to write TermKit native commands can be found here:
https://github.com/unconed/TermKit/blob/master/Node-API.md

## Credits

TermKit by [Steven Wittens](http://acko.net) ([@unconed](https://twitter.com/unconed)).

Windows port by James Rhodes ([@hachque](https://twitter.com/hachque)).

Linux Python/GTK wrapper by [Lucas S. Magalhães](https://github.com/lucassmagal).

Includes:

* “NSImage+QuickLook” by Matt Gemmell (http://mattgemmell.com/source).
* SyntaxHighlighter by Alex Gorbatchev (http://alexgorbatchev.com/SyntaxHighlighter/)
* jQuery and jQuery UI

## license
> Copyright (c) 2009-2012, Steven Wittens
>
> All rights reserved.
>
>
>
>
> Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
>
>
> 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
>
> 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
>
> 3. The names of contributors may not be used to endorse or promote products derived from this software without specific prior written permission.
>
>
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.