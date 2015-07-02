//Custom JavaScript Functions by Shawn Olson
//Copyright 2006-2011
//http://www.shawnolson.net
//If you copy any functions from this page into your scripts, you must provide credit to Shawn Olson & http://www.shawnolson.net
//*******************************************

 /*   function stripCharacter(words,character) {
    //documentation for this script at http://www.shawnolson.net/a/499/
      var spaces = words.length;
      for(var x = 1; x<spaces; ++x){
       words = words.replace(character, "");
     }
     return words;
    }*/

        function changecss(theClass,element,value) {
        //Last Updated on July 4, 2011
        //documentation for this script at
        //http://www.shawnolson.net/a/503/altering-css-class-attributes-with-javascript.html
         var cssRules;


         for (var S = 0; S < document.styleSheets.length; S++){


              try{
                document.styleSheets[S].insertRule(theClass+' { '+element+': '+value+'; }',document.styleSheets[S][cssRules].length);

              } catch(err){
                    try{document.styleSheets[S].addRule(theClass,element+': '+value+';');

                    }catch(err){

                        try{
                            if (document.styleSheets[S]['rules']) {
                              cssRules = 'rules';
                             } else if (document.styleSheets[S]['cssRules']) {
                              cssRules = 'cssRules';
                             } else {
                              //no rules found... browser unknown
                             }

                              for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
                               if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
                                if(document.styleSheets[S][cssRules][R].style[element]){
                                document.styleSheets[S][cssRules][R].style[element] = value;
                                break;
                                }
                               }
                              }
                          } catch (err){}



                    }

              }


        }
    }

 /*   function checkUncheckAll(theElement) {
     var theForm = theElement.form, z = 0;
     for(z=0; z<theForm.length;z++){
      if(theForm[z].type == 'checkbox' && theForm[z].name != 'checkall'){
      theForm[z].checked = theElement.checked;
      }
     }
    }

function checkUncheckSome(controller,theElements) {
    //Programmed by Shawn Olson
    //Copyright (c) 2006-2011
    //Updated on April 2, 2011
    //Permission to use this function provided that it always includes this credit text
    //  http://www.shawnolson.net
    //Find more JavaScripts at http://www.shawnolson.net/topics/Javascript/

    //theElements is an array of objects designated as a comma separated list of their IDs
    //If an element in theElements is not a checkbox, then it is assumed
    //that the function is recursive for that object and will check/uncheck
    //all checkboxes contained in that element

     var formElements = theElements.split(',');
     var theController = document.getElementById(controller);
     for(var z=0; z<formElements.length;z++){
      theItem = document.getElementById(formElements[z]);
      if(theItem.type && theItem.type=='checkbox'){

            theItem.checked=theController.checked;

      } else {
          theInputs = theItem.getElementsByTagName('input');
      for(var y=0; y<theInputs.length; y++){
      if(theInputs[y].type == 'checkbox' && theInputs[y].id != theController.id){
         theInputs[y].checked = theController.checked;
        }
      }
      }
    }
}

    function changeImgSize(objectId,newWidth,newHeight) {
      imgString = 'theImg = document.getElementById("'+objectId+'")';
      eval(imgString);
      oldWidth = theImg.width;
      oldHeight = theImg.height;
      if(newWidth>0){
       theImg.width = newWidth;
      }
      if(newHeight>0){
       theImg.height = newHeight;
      }

    }

    function changeColor(theObj,newColor){
      eval('var theObject = document.getElementById("'+theObj+'")');
      if(theObject.style.backgroundColor==null){theBG='white';}else{theBG=theObject.style.backgroundColor;}
      if(theObject.style.color==null){theColor='black';}else{theColor=theObject.style.color;}
      //alert(theObject.style.color+' '+theObject.style.backgroundColor);
      switch(theColor){
        case newColor:
          switch(theBG){
            case 'white':
              theObject.style.color = 'black';
            break;
            case 'black':
              theObject.style.color = 'white';
              break;
            default:
              theObject.style.color = 'black';
              break;
          }
          break;
        default:
          theObject.style.color = newColor;
          break;
      }
    }*/