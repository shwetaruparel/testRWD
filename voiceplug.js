
var final_transcript = '';
var objecttext='';
var recognizing = false;
var uttering = false;
var ignore_onend = false;
var start_timestamp;
var arrresp=[];
var arrmsg="";
var msgidx=0;
var taxamount =0;
var stamount = 0;
var tamount = 0;
var addresschk="";
var zip="";
var city="";
var state="";
var qty=1;
var editflag=0;						//If the edit link is clicked to change the item qty/size
var doneflag=0;						//If Card Details are sent using voice
var transflag=0 ; 					//Transaction complete
var sizeid="";
var prodid="";
var speakmsg="please try again";
var synth = window.speechSynthesis;
var utterThis = new SpeechSynthesisUtterance();
var voices = speechSynthesis.getVoices();	
var headerrow =0;
var langs = [-
  ['Afrikaans', ['af-ZA']],
  ['Bahasa Indonesia', ['id-ID']],
  ['Bahasa Melayu', ['ms-MY']],
  ['Català', ['ca-ES']],
  ['Čeština', ['cs-CZ']],
  ['Dansk', ['da-DK']],
  ['Deutsch', ['de-DE']],
  ['English', ['en-AU', 'Australia'],
    ['en-CA', 'Canada'],
    ['en-IN', 'India'],
    ['en-NZ', 'New Zealand'],
    ['en-ZA', 'South Africa'],
    ['en-GB', 'United Kingdom'],
    ['en-US', 'United States']
  ],
  ['Español', ['es-AR', 'Argentina'],
    ['es-BO', 'Bolivia'],
    ['es-CL', 'Chile'],
    ['es-CO', 'Colombia'],
    ['es-CR', 'Costa Rica'],
    ['es-EC', 'Ecuador'],
    ['es-SV', 'El Salvador'],
    ['es-ES', 'España'],
    ['es-US', 'Estados Unidos'],
    ['es-GT', 'Guatemala'],
    ['es-HN', 'Honduras'],
    ['es-MX', 'México'],
    ['es-NI', 'Nicaragua'],
    ['es-PA', 'Panamá'],
    ['es-PY', 'Paraguay'],
    ['es-PE', 'Perú'],
    ['es-PR', 'Puerto Rico'],
    ['es-DO', 'República Dominicana'],
    ['es-UY', 'Uruguay'],
    ['es-VE', 'Venezuela']
  ],
  ['Euskara', ['eu-ES']],
  ['Filipino', ['fil-PH']],
  ['Fran-çais', ['fr-FR']],
  ['Galego', ['gl-ES']],
  ['Hrvatski', ['hr_HR']],
  ['IsiZulu', ['zu-ZA']],
  ['Íslenska', ['is-IS']],
  ['Italiano', ['it-IT', 'Italia'],
    ['it-CH', 'Svizzera']
  ],
  ['Lietuvių', ['lt-LT']],
  ['Magyar', ['hu-HU']],
  ['Nederlands', ['nl-NL']],
  ['Norsk bokmål', ['nb-NO']],
  ['Polski', ['pl-PL']],
  ['Português', ['pt-BR', 'Brasil'],
    ['pt-PT', 'Portugal']
  ],
  ['Română', ['ro-RO']],
  ['Slovenščina', ['sl-SI']],
  ['Slovenčina', ['sk-SK']],
  ['Suomi', ['fi-FI']],
  ['Svenska', ['sv-SE']],
  ['Tiếng Việt', ['vi-VN']],
  ['Türkçe', ['tr-TR']],
  ['Ελληνικά', ['el-GR']],
  ['български', ['bg-BG']],
  ['Pусский', ['ru-RU']],
  ['Српски', ['sr-RS']],
  ['Українська', ['uk-UA']],
  ['한국어', ['ko-KR']],
  ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
    ['cmn-Hans-HK', '普通话 (香港)'],
    ['cmn-Hant-TW', '中文 (台灣)'],
    ['yue-Hant-HK', '粵語 (香港)']
  ],
  ['日本語', ['ja-JP']],
  ['हिन्दी', ['hi-IN']],
  ['ภาษาไทย', ['th-TH']]
];
utterThis.volume = 1; // 0 to 1
utterThis.rate = 1.5; // 0.1 to 10
utterThis.pitch = 1.5; //0 to 2
voices = speechSynthesis.getVoices();
utterThis.voice= voices[1];				

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
 
	var recognition = new webkitSpeechRecognition() || new SpeechRecognition();  
	recognition.continuous = true;
	recognition.interimResults = true;

  recognition.onstart = function(event) {
	final_transcript='';
	msgidx=0;
	arrresp=[];
	console.log("start speaking"+event.timeStamp);
    recognizing = true;
    start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif';
  };

  recognition.onerror = function(event) {
	console.log(event.error);
    if (event.error == 'no-speech') {

      start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
		start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';

      ignore_onend = true;
    }
	recognizing = false;
  };

  recognition.onend = function(event) {
	console.log("end speaking"+event.timeStamp);
	console.log(final_transcript+" and messageindex" +msgidx);
	if(final_transcript!="" && msgidx==0)
	{
		arrresp=[];
		console.log("The response is blank , there is new rep to every request");
		sendreq(event);
	}
	recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
  };

  recognition.onresult = function(event) {
	  //console.log(event.results);
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
		final_transcript += event.results[i][0].transcript;
		interim_transcript="";
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
	document.getElementById("final_span").innerHTML = linebreak(final_transcript);
	if(interim_transcript=="" && recognizing)
		recognition.stop();
  };
}
function sendreq(event)
{
	
	recognizing=false;
	console.log("sending request here , no need to recognize");
	recognition.stop();
	//console.log("Uttering"+uttering);
	//console.log("Recognizing"+recognizing);
	console.log(objecttext);
	if (objecttext!='')
		$("#"+objecttext)[0].value=final_transcript;
	
	objecttext="";
	var xhr = new XMLHttpRequest();
	if (final_transcript =='')
		final_transcript='Hello';
	var json = JSON.stringify({
	  "message": final_transcript
	});
	xhr.open("POST", "https://a0fe46ac1666.ngrok.io/webhooks/rest/webhook",true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.responseType = "";
	//console.log(json);
	xhr.send(json);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   // Typical action to be performed when the document is ready:
			arrresp = xhr.responseText.split("{");
			console.log("getting ready for response"+xhr.responseText);
			msgidx=0;
			qty=1;
			headerrow=0;
			speak();
		}
	};
}
function upgrade() {
  start_button.style.visibility = 'hidden';
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
	msgidx=0;
	if(transflag)
	{
		pageload(event);
	}
	if (recognizing) {
		recognition.stop();
		recognizing = false;
		return;
	}
	final_transcript = '';
	recognition.lang = 'en-US';
	//recognizing = true;
	recognition.start();

	ignore_onend = false;
	start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif';
	start_timestamp = event.timeStamp;

}
function pageload(event)
{
	//console.log(event);
	recognizing=false;
	uttering = true;
	transflag=0;
	final_transcript="Start Voice Order";
	sendreq(event);
	//recognition.start();
	//$("#DeliveryDialog").show();
	//$("#AddressDialog").show();
}

function speak()
{
	utterThis.volume = 1; // 0 to 1
	utterThis.rate = 1.5; // 0.1 to 10
	utterThis.pitch = 1.5; //0 to 2
	voices = speechSynthesis.getVoices();
	utterThis.voice= voices[1];				
	if(msgidx <	arrresp.length)
	{	
		arrmsg = arrresp[msgidx];
		console.log("This is the index"+msgidx+"Array Response at index"+arrmsg +"array response length"+arrresp.length);
		if (arrmsg.search("build_order") > 0)
		{
			final_transcript="yes";
			sendreq(event);
			return false;
		}
		var txtidx= arrmsg.search("text");
		if (txtidx > 0)
		{
			var speakm="";
			speakm = arrmsg.substr(txtidx,(arrmsg.search("}")-txtidx));
			var arrspeakm = speakm.split(":");
			speakmsg = arrspeakm[1];
			utterThis = new SpeechSynthesisUtterance();
			utterThis.volume = 1; // 0 to 1
			utterThis.rate = 1.5; // 0.1 to 10
			utterThis.pitch = 1.5; //0 to 2
			voices = speechSynthesis.getVoices();
			utterThis.voice= voices[1];				

			if (speakmsg.length > 2 && (speakmsg.search("start#")<0 && speakmsg.search("screen") < 0 && speakmsg.search("orderlist") < 0 && speakmsg.search("delivertype")<0 && speakmsg.search("checkout#") < 0 && speakmsg.search("phone#")<0 && speakmsg.search("firstname#")<0 && speakmsg.search("street#")< 0 && speakmsg.search("city#")< 0 && speakmsg.search("state#")< 0 && speakmsg.search("confirmation#")< 0 && speakmsg.search("zipcode#")< 0 && speakmsg.search("addressconfirm#")< 0 && speakmsg.search("cardinfo#")< 0 && speakmsg.search("zip#")< 0 && speakmsg.search("ccnoconfirm#")< 0 && speakmsg.search("showmenu#")< 0 && speakmsg.search("additem#")< 0 && speakmsg.search("nolist#")< 0 ))
			{
				console.log("Here are the messages to speak"+speakmsg);
				utterThis.text=speakmsg;				
				texttospeak(event);	
				headerrow=0;
				editflag=0;
				//prodid="";
				qty=1;
			}
			else
			{
				console.log("Here are the messages to speak"+speakmsg);
				if(speakm.search("start#")>0)
				{
					
					$("#DeliveryTypeCheck")[0].style.display="block";
					$("#precheck-begin-order")[0].style.display="block";
					$("#newAddressForm")[0].style.display="none";
					$("#zipcodego")[0].style.display="none";
					$("#findLocationsInput")[0].style.display="none";
					$("#CCardForm")[0].style.display="none";
					$("#DeliveryDialog").show();
					utterThis.text = speakm.split("#")[1];
					texttospeak(event);
				}
				if(speakm.search("screen") > 0)
				{
					$("#PopupDialog").hide();
					var arrscr = speakmsg.split("#");
					var catid = "CategoryItem"+(arrscr[1]).replace("\"","");
					console.log("Category id ::"+catid);
					if(document.getElementById(catid)!=null)
						document.getElementById(catid).click();
					else
					{
						
						//console.log((arrscr[1].split(",")[0]).replace("\"",""));
						qty=arrscr[1].split(",")[1].replace("\"","");
						($(".Products").find("li").filter("#prod"+((arrscr[1].split(",")[0]).replace("\"","")))).click();
						prodid=arrscr[1].split(",")[0];
						//console.log("Product Clicked or chosen"+prodid);
					}
					msgidx=msgidx+1;
					speak();
				}
				if(speakm.search("additem#") > 0)
				{
					qty= speakmsg.split("additem#")[1].split(",")[0];
					sizeid=speakmsg.split("additem#")[1].split(",")[1];	
					console.log("Size of the order"+sizeid);
					$("#frmCustomize").find(".OptionContainer").find("li").each(function(){
						if($(this)[0].children[0].value== sizeid)
							$(this)[0].children[0].checked=true;
					});
					utterThis.text= speakmsg.split("additem#")[1].split(",")[2];
					texttospeak(event);
				}
				if(speakm.search("orderlist#") > 0)
				{
					console.log("Show Cart Information");
					$("#PopupDialog").hide();
					if(speakm.split("order#")[1] == 0)
					{
						$("#OrderDialog").find(".BasketViewContainer").find("#OrderList").empty();
						msgidx=msgidx+1;
						return false;
					}
					var arrlist = speakm.split(",");
					var container= $("#OrderDialog").find(".BasketViewContainer").find("#OrderList");
					
					if(headerrow == 0)
					{
						container.empty();
						container.append("<tr><th><h3>Item</h3> </th><th style='text-align:center'><h3>Size</h3></th><th style='text-align:center'><h3>Amount</h3></th></tr>");
						headerrow = 1;
						txamount=0;
						stamount=0;
						tamount=0;
					}
					container.append("<tr><td><dl>"+arrlist[2]+" X "+arrlist[0].split("#")[1]+"</dl></td><td style='text-align:right'><dl>"+arrlist[1]+"</dl></td><td style='text-align:right'><dl>"+arrlist[4].split("\"")[0]+"</dl></td></tr>");
					container.append("<tr><td colspan=\"3\">[<a onclick=\"editquery(event)\">edit </a>|<a onclick=\"removequery(event)\"> remove</a>]</td></tr>");
					container.append("<tr><td colspan=\"3\"></td></tr>");
					container.append("<tr><td colspan=\"3\">&nbsp;</td></tr>");
					stamount = stamount + parseFloat(arrlist[4].split("\"")[0].replace("$",""));
					txamount = 0.0725 * stamount;
					tamount = txamount +stamount;
					//console.log("Sub Total Amount"+stamount);
					//console.log("Tax Amount"+txamount);
					//console.log("Total Amount"+tamount);
					$("#sbTotal")[0].innerText=stamount.toFixed(2);
					$("#txTotal")[0].innerText=txamount.toFixed(2);
					$("#fTotal")[0].innerText=tamount.toFixed(2);
					msgidx=msgidx+1;
					speak();

				}	
				if(speakm.search("delivertype") > 0)
				{
					var arrorder = speakmsg.split("#")[1];
					//console.log(arrorder);
					if (arrorder=="delivery")
					{
						$("#HandoffModeDispatch")[0].checked="true";

					}
					else
					{
						$("#HandoffModeCounterPickup")[0].checked="true";

					}
					$("#precheck-begin-order")[0].style.display="none";
					$("#ZipCodeStart")[0].style.display="block";
					$("#zipcodego")[0].style.display="block";
					$("#findLocationsInput")[0].style.display="block";
					$("#newAddressForm")[0].style.display="none";
					$("#CCardForm")[0].style.display="none";
					$("#DeliveryTypeCheck")[0].style.display="block";
					$("#DeliveryDialog").show();
					
					utterThis.text= speakmsg.split("#")[3];					
					texttospeak(event);
					objecttext="ZipCodeStart";
				}
				if(speakm.search("zipcode#")>0)
				{		
					var zipcs=speakm.split("zipcode#")[1].split(",");
					zip=zipcs[0];
					city=zipcs[1];
					state=zipcs[2].replace("\"","");
					console.log(speakmsg);
					msgidx=msgidx+1;
					$(".adr")[0].style.display="block";
					speak();
					$("#DeliveryDialog").hide();					
				}
				if(speakm.search("checkout#")>0)					
				{
					
					var chkscr=speakm.split("checkout#")[1].split(",");
					$("#CartDialog").find("#dialogTitle-2")[0].innerText="Order Information";
					if((chkscr[0] =="OrderID"))
					{
						$("#CartDialog").find("#CartTitle")[0].innerText=chkscr[1].split("\"")[0];
					}
					if((chkscr[0] =="ItemDetails"))
					{
						var container=$("#CartDialog").find(".BasketViewContainer").find("#BasketProducts");
						//console.log(chkscr);
						if(headerrow == 0)
						{
							container.empty();
							container.append("<tr><td colspan='5'><td></tr>");
							container.append("<tr><td><h3> &nbsp; Item Name &nbsp; </h3></td><td style='text-align:center'><h3> &nbsp; Size &nbsp;</h3></td><td style='text-align:center'><h3> &nbsp; Quantity &nbsp; </h3></td><td style='text-align:center'><h3> &nbsp; Price &nbsp; </h3></td><td style='text-align:center'><h3> &nbsp; Amount &nbsp; </h3></td></tr>");
							container.append("<tr><td colspan='5'>&nbsp;<td></tr>");
							headerrow = 1;
						}
						container.append("<tr><td><dl>"+chkscr[1]+"</dl></td><td style='text-align:center'><dl>"+chkscr[2]+"</dl></td><td style='text-align:center'><dl>"+chkscr[3]+"</dl></td><td style='text-align:center'><dl>"+chkscr[4].split("\"")[0]+"</dl></td><td style='text-align:center'><dl>"+chkscr[5].split("\"")[0]+"</dl></td></tr>");
						container.append("<tr><td colspan='5'>&nbsp;<td></tr>");
					}
					if((chkscr[0] =="TAmount"))
					{
						//console.log(chkscr[1]);
						stamount = parseFloat(chkscr[1].split("\"")[0].split("$")[1]);
						taxamount = 0.0725 * stamount;
						tamount = taxamount +stamount;
						
						//console.log($("#CartDialog").find(".BasketViewContainer").find("#BasketTotals"));
						//$("#CartDialog").find(".BasketViewContainer").find("#BasketTotals")[0].children[0].innerText=chkscr[1].split("\"")[0];
						$("#CartDialog").find(".BasketViewContainer").find("#BasketProducts").append("<tr><td colspan='4'><h3>SUB TOTAL AMOUNT</h3></td><td style ='text-align:right;'><h3>"+stamount.toFixed(2)+"</h3></td></tr>");
						$("#CartDialog").find(".BasketViewContainer").find("#BasketProducts").append("<tr><td colspan='4'><h3>TAX AMOUNT</h3></td><td style ='text-align:right;'><h3>"+taxamount.toFixed(2)+"</h3></td></tr>");
						$("#CartDialog").find(".BasketViewContainer").find("#BasketProducts").append("<tr><td colspan='4' ><h3>TOTAL AMOUNT</h3></td><td style ='text-align:right;'><h3>"+tamount.toFixed(2)+"</h3></td></tr>");

					}
					$("#CartDialog").find("#PersonalInfo").find("#personphone")[0].value="";
					$("#CartDialog").find("#PersonalInfo")[0].style.display="block";
					$("#personphone")[0].focus();
					$("#CartDialog").show();

					msgidx=msgidx+1;
					speak();

				}
				if(speakm.search("phone#")>0)									
				{
					$("#personname")[0].focus();
					console.log(speakmsg);
					utterThis.text= speakmsg.split("#")[1];
					texttospeak(event);
					objecttext="personphone";
				}		
				if(speakm.search("firstname#")>0)									
				{
					$("#AddressDialog").hide();
					//console.log(final_transcript);
					console.log(speakmsg);
					$("#person-phone")[0].value= $("#personphone")[0].value;
					objecttext="personname";
					utterThis.text= speakmsg.split("#")[1];
					if(doneflag==0)
						texttospeak(event);
					else
						provideCustInfo();
					askDetails();
				}
				if(speakm.search("street#")>0)									
				{
					$("#personname")[0].value=final_transcript;

					console.log(speakmsg);speakm.split("#")[1].split(",")[1]
					objecttext="streetaddress";					

					utterThis.text= speakmsg.split("#")[1];
					if(doneflag==0)
						texttospeak(event);
					else
						provideCustInfo();

					askDetails();
				}
				if(speakm.search("city#")>0)									
				{
					$("#streetaddress")[0].value=final_transcript;
					console.log(speakmsg);
					objecttext="city";

					utterThis.text= speakmsg.split("#")[1];
					if(doneflag==0)
						texttospeak(event);
					else
						provideCustInfo();

				}
				if(speakm.search("state#")>0)									
				{
					$("#city")[0].value=final_transcript;
					city=final_transcript;
					console.log(speakmsg);
					objecttext="state";
					utterThis.text= speakmsg.split("#")[1];
					if(doneflag==0)
						texttospeak(event);
					else
						provideCustInfo();

				}
				if(speakm.search("confirmation#")>0)
				{
					//console.log($("#confirmation"));
					//console.log($("#ordernumber"));
					$("#CartDialog").hide();
					$("#DeliveryDialog").hide();
					$("#orderno")[0].innerText= speakm.split("#")[1].split(",")[0];
					$("#custnum")[0].innerText= speakm.split("#")[1].split(",")[1];
					$("#custname")[0].innerText= speakm.split("#")[1].split(",")[2];
					$("#confirmessg")[0].innerText=speakm.split("#")[1].split(",")[3].split(".")[0];
					$("#ConfirmationDialog").show();
					$("#OrderDialog").find(".BasketViewContainer").find("#OrderList").empty();
					transflag=1;
					utterThis.text = speakm.split("#")[1].split(",")[3];
					texttospeak(event);
					recognizing=false;
					recognition.stop();
				}
				if(speakm.search("addressconfirm#")>0)									
				{
					console.log(speakmsg);
					$("#AddressDialog").find("#dialogTitle-5")[0].innerText="Check Address";
					$("#CartDialog").hide();
					$("#DeliveryDialog").hide();
					//console.log($("#confirmaddress"));
					//console.log($("#confirmaddress"));
					$("#confirmaddress")[0].style.display="block";
					$("#ccconfirm")[0].style.display="none";
					$("#confirmaddress")[0].children[0].children[0].innerText = speakmsg.split("addressconfirm#")[1].split(",")[0] +"," +speakmsg.split("#")[1].split(",")[1]; 
					$("#AddressDialog").show();
					$("#streetaddress")[0].value=speakmsg.split("#")[1].split(",")[0];
					$("#city")[0].value=speakmsg.split("#")[1].split(",")[1];
					utterThis.text= speakmsg.split("#")[1].split(",")[2];
					texttospeak(event);						
						
				}
				if(speakm.search("cardinfo#")>0)
				{
					//console.log(speakmsg);
					$("#AddressDialog").hide();
					//$("#DeliveryDialog").find("#dialogTitle-9").innerText="Card Information";
					$("#newAddressForm")[0].style.display="none";
					$("#DeliveryTypeCheck")[0].style.display="none";
					$("#CCardForm")[0].style.display="block";
					$("#DeliveryDialog").show();
					
					if(speakm.search("cardnum#")>0)									
					{
						console.log(speakmsg)
						objecttext="cardnumber";
						utterThis.text= speakmsg.split("cardnum#")[1];

						if(doneflag==0)
						{
							texttospeak(event);
						}
						else
							provideCardInfo();

					}		
					if(speakm.search("cardmonth#")>0)									
					{
						objecttext="expmonth";
						console.log(speakmsg);
						utterThis.text= speakmsg.split("cardmonth#")[1];
						if(doneflag==0)
						{

							texttospeak(event);
						}
						else
							provideCardInfo();

					}		
					if(speakm.search("cardyear#")>0)									
					{
						objecttext="expyear";
						console.log(speakmsg);
						utterThis.text= speakmsg.split("cardyear#")[1].split(",")[1];

						if(doneflag==0)
						{
							texttospeak(event);
						}
						else	
							provideCardInfo();

					}		
					if(speakm.search("cardcvv#")>0)									
					{
						objecttext="cvv";
						console.log(speakmsg);
						utterThis.text= speakmsg.split("cardcvv#")[1].split(",")[1];

						if(doneflag==0)
						{
							texttospeak(event);
						}
						else
							provideCardInfo();
					}		
					if(speakm.search("cardname#")>0)									
					{
						objecttext="cname";
						console.log(speakmsg);
						utterThis.text= speakmsg.split("cardname#")[1];

						if(doneflag==0)
						{	
							texttospeak(event);
						}
						else
							provideCardInfo();

					}		
				}
				if(speakm.search("zip#")>0)									
				{
					objecttext="czip";
					console.log(speakmsg);
					utterThis.text= speakmsg.split("zip#")[1];
					if(doneflag==0)
					{
						texttospeak(event);
					}
					else
						provideCardInfo();

				}							
				if(speakm.search("ccnoconfirm#")>0)									
				{
					$("#AddressDialog").hide();
					$("#CartDialog").hide();
					$("#DeliveryDialog").hide();
					$("#AddressDialog").find("#dialogTitle-5")[0].innerText="Check Card";
					console.log(speakmsg);
					var msg=speakmsg.split("ccnoconfirm#")[1].split(",");
					$("#cardnumber")[0].value="xxxxxxxxxxxx"+msg[0];
					$("#expmonth")[0].value=msg[1];
					$("#expyear")[0].value=msg[2];
					$("#cname")[0].value=msg[3];
					$("#czip")[0].value=msg[4];
					$("#cvv")[0].focus();
					$("#ccconfirm")[0].style.display="block";
					$("#confirmaddress")[0].style.display="none";
					$("#precheck-begin-order")[0].style.display="none";
					$("#zipcodego")[0].style.display="none";
					$("#ccmessg")[0].innerText="Card ending in "+msg[0];
					$("#AddressDialog").show();
					utterThis.text= msg[5];
					texttospeak(event);
					objecttext="";
				}							
				if(speakm.search("showmenu#")>0)									
				{
					$("#CategoryItem10005")[0].click();
					console.log(speakmsg);
					utterThis.text= speakmsg.split("showmenu#")[1];
					texttospeak(event);
				}							
				if(speakm.search("nolist#")>0)									
				{
					console.log(speakmsg);
					utterThis.text= speakmsg.split("nolist#")[1];
					texttospeak(event);
				}							

			}
		}
		else{
			msgidx= msgidx+1;
			speak();
		}
	}
	else{	
		msgidx=0;
		arrresp=[];
		//recognizing = false;
		}
}
function provideCustInfo()
{	
		msgidx=msgidx+1;
		if(($("#"+objecttext)[0].value)!="")
		{
			final_transcript= $("#"+objecttext)[0].value;
			sendreq(event);
		}
		else
		{	
			//utterThis.text= speakmsg.split("cardname#")[1];
			texttospeak(event);
			doneflag=0;
		}
}

function provideCardInfo()
{	
	//console.log(x);
		msgidx=msgidx+1;
		if(($("#"+objecttext)[0].value)!="")
		{
			final_transcript= $("#"+objecttext)[0].value;
			sendreq(event);
		}
		else
		{	
			//utterThis.text= speakmsg.split("cardname#")[1];
			texttospeak(event);
			doneflag=0;
		}
}


function texttospeak(event)
{
	msgidx=msgidx+1;
	uttering=true;
	recognizing=false;
	console.log("I am going to speak, so lets stop recognizing");
	recognition.stop();

	synth.speak(utterThis);
	utterThis.onend = function (event) {
		if(msgidx < arrresp.length)
		{
			uttering=false;
			speak();
		}
		else
		{
			recognizing=true;
			uttering=false;
			console.log("I am done with speaking ,lets start recognizing");
			if (!transflag )
				recognition.start();
			else
			{
				recognizing =false;
				recognition.stop();
			}
			//$("#CartDialog").hide();
		}		
		console.log('SpeechSynthesisUtterance.onend'+msgidx);		
	};
	utterThis.onerror = function (event) {
		uttering = false;
		console.error('SpeechSynthesisUtterance.onerror');
		msgidx=msgidx+1;
		if(msgidx < arrresp.length)
		{
			speak();
			uttering=false;
		}
		else
		{
			final_transcript='Please Try Again';
			msgidx=0;
			arrresp=[];
			recognizing=true;
			uttering=false;
			//recognition.start();			
		}		
	};

	utterThis.onstart = function (event) {
		uttering=true;
		console.log('SpeechSynthesisUtterance.onstart'+msgidx);
	};

}
function takeAction(x,field)
{
	console.log(x);
	if(field=='address')
		addresschk=x;
	if(field=='card')
	{
		if (x=='same card')
		{
			$("#cardnumber")[0].disabled=true;
			$("#expmonth")[0].disabled=true;
			$("#expyear")[0].disabled=true;
			$("#cname")[0].disabled= true;
			$("#czip")[0].disabled=true;
			$("#cvv")[0].focus();
		}
		else
		{
			$("#cardnumber")[0].disabled=false;
			$("#expmonth")[0].disabled=false;
			$("#expyear")[0].disabled=false;
			$("#cname")[0].disabled= false;
			$("#czip")[0].disabled=false;
			$("#cardnumber")[0].focus();

		}
		cardcheck=x;
	}
	final_transcript=x;
	sendreq(event);
	$("#AddressDialog").hide();
}

function askDetails()
{
	console.log("I am in asking Details");
	var formfields = $("#newAddressForm").find(".formfield");
	console.log(formfields);
	$("#DeliveryDialog").find("#dialogTitle-9")[0].innerText="Checkout Details";
	if($("#HandoffModeCounterPickup")[0].checked || addresschk=="same address" )
	{
		$("#addrinfo")[0].style.display="none";
	}
	else{
		$("#addrinfo")[0].style.display="block";	
	}
	$("#DeliveryTypeCheck")[0].style.display="none";
	$("#newAddressForm")[0].style.display="block";
	$("#precheck-begin-order")[0].style.display="none";
	$("#zipcodego")[0].style.display="none";
	$("#person-phone")[0].value=$("#personphone")[0].value;
	if(city !="")
		$("#city")[0].value=city;
	if(state!="")
		$("#state")[0].value=state;
	$("#zipcode")[0].value=zip;
		//console.log($("#DeliveryDialog"));
	$("#CartDialog").hide();
	$("#AddressDialog").hide();
	$("#DeliveryDialog").show();

}

function editquery()
{
	var prodid="";
	console.log(event.path[2].previousSibling.children[1].innerText);
	console.log(event.path[2].previousSibling.children[0].innerText.split("X")[1]);
	editflag=1;
	$(".Products").find("li").each(function(){
		//console.log($(this).find(".product__name")[0].innerText);
		if((($(this).find(".product__name")[0].innerText).trim()).toUpperCase()==((event.path[2].previousSibling.children[0].innerText.split("X")[1]).trim()).toUpperCase())
		{
			qty=event.path[2].previousSibling.children[0].innerText.split("X")[0];
			sizeid= event.path[2].previousSibling.children[1].innerText;
			$(this)[0].click();
			return false;
		}
	});
	
}
function removequery()
{
	var removetext="";
	//console.log(event.path[2].previousSibling.children[0].innerText.split("X")[0]);
	
	//console.log(event.path[2].previousSibling.children[1].innerText);
	//console.log(event.path[2].previousSibling.children[0].innerText.split("X")[1]);
	final_transcript="Remove "+(event.path[2].previousSibling.children[0].innerText).split("X")[0]+" "+event.path[2].previousSibling.children[1].innerText+" size "+(event.path[2].previousSibling.children[0].innerText).split("X")[1];
	console.log("Remove Query" +final_transcript);
	sendreq(event);
}

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  for (var i = 0; i < langs.length; i++) {
	select_language.options[i] = new Option(langs[i][0], i);
	}
	
}
function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}
