[![Build Status](https://travis-ci.org/tc-ca/alexa-gc-recalls.svg?branch=master)](https://travis-ci.org/tc-ca/alexa-gc-recalls)
 [![codecov](https://codecov.io/gh/tc-ca/alexa-gc-recalls/branch/master/graph/badge.svg)](https://codecov.io/gh/tc-ca/alexa-gc-recalls/)


#  Vehicle Recalls Canada Skill
![image of skill icon](/images/banner-github-01.png)


**Vehicle Recalls Canada skill** is a research project exploring how government services can be provided through voice interface. 
The Skill allows users to look up vehicle recall information found on Transport Canada [Safety Recalls website](http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/menu.aspx?lang=eng) through Alexa enabled device.


## Origin

This project got its start through the Government’s OneGC Program Office which hosted an Alexa [proof-of-concept](https://www.youtube.com/watch?v=jkA7NmMNpl4) for period of two weeks.
* Proof-of-Concept
  * [Lessons Learned](https://wiki.gccollab.ca/Lessons_learned_-_OneGC_Alexa_Proof-of-Concept)
  * [Source Code](https://github.com/canada-ca/alexapoc-vdpalexa)
  * [Wiki ](https://github.com/canada-ca/alexapoc-vdpalexa/wiki)


## Data Source


This Skill leverages GC API Store [GC API Store](https://api.canada.ca/en/homepage) to retrieve vehicle recall information which can be query by users through Alexa. 

## Developer Setup
* Account creation for
  * Alexa Skill Developer Console (frontend) https://developer.amazon.com/
  * AWS (backend) http://console.aws.amazon.com/

## Deployment Configuration:
Set Lambda timeout to 7 seconds the maximum allowed for an Alexa skill.

## Alexa Documentation
https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html
