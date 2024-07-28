- format usage in USD as per the utils -> should be in dollars until the K USD
- add space between the USD and tokens
- switch to heroicons in header
  - API -> cog
  - USD -> currency-dollar
  - Tokens -> pencil-square
- Use responsive font sizes for headers on mobile
- the image in the header is искажено when displayed on mobile
- message input, if it receives React code it tries to render it (it shouldn't it). How to reproduce:
-> copy and paste the source code for header component -> I see rendered header - ahahah. How to fix? Let's think first.
- align the three dots animation with the messages container with padding. .
- Hide the sidebar completely (make it hidden) unless it's open on mobile

- the text input on mobile is below the URL bar on Safari. Can I make it always sticky at the bottom area? How would this impact the desktop?


For each of the changes, before writing a single line of code, please do scoping:
- what needs to change
- where, what files, what lines
- consider edge cases

Then provide step by step guide for each point so that I can implement -> test -> continue