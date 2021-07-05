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

<img align="left" width="15%" height="15%" src="https://api.canada.ca/sites/api-store-drupal-prod.apps.prod.openshift.ised-isde.canada.ca/files/2019-02/api-logo.png">

This Skill leverages [GC API Store](https://api.canada.ca/en/homepage) to retrieve vehicle recall information which can be query by users through Alexa. 


## Deployment:
Set Lambda timeout to 7 seconds. 
