import fetch from 'node-fetch';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import { SearchData, DetailData } from './type';
import { writeCsv } from '@/fs';
import { delay } from '@/utils';

const Cookie = `SECKEY_ABVK=hF4qj+mx8AZ9DvpFwQSvrA8ZjrIjfaFGa6vvPVGE4lM%3D; BMAP_SECKEY=cRDazFQYzYJY6sOHAVahf8LwO7fcrU4RPHddiPdy5u_MSD21dVSvqpX3MLT5vFPq3RyZV3S9UmDE8Us6DXzSJmyHwrTaoS8asVtvsuXDrPw_apByDxyJpOCjPjUh0BBzU2U5Gr3HhCmhc8Y8l-KvSkAZajpM1Dvz7RrJ1pOB6lFWLLr0vyeoH3XOhKMsHZIx; MI_Visitor=DFCBBB33-7B45-52A2-BFF3-0E8BA8B178CE; JVMID=aries-play-search-app-green-10-xmw58; 7f43ca11c4dc21bb60196804ca3a8e4a=0fbca2f5c3da9db360f1e2a2842b063d; MI_SITE=prod16; x-mi-tag=rel-R22.8.1; 48e12f862218573e03bad597af586e4a=c1bb1a75e6117106a80d4c59bd11378b; 9bcb0189543e0c57619675a1e489dad6=00646728a517256e8c2ac4ba05b1e8bb; akacd_wwwprodcnfirst=3837283794~rv=29~id=be55b0bae3470d617fd91f29e8b559e4; ZMz286iJ=f%3DA_by03eCAQAAZlaLRaIvt1uxHa3KndsNg_2L9H5O5rKbiMy_t5CSRrpRA8K5AZkDo-icuG46wH8AAEB3AAAAAA%253D%253D%26b%3Devbh4p%26c%3DAABFv3eCAQAATQqITP7PQBZu4zN7icGdH7Z0_qWeX7nzVtYa6rWWWS1pmujB%26d%3DABYAgACAAIAAgACAAQC1llktaZrowQAAAABrKlY4AEOVhDXJXCkEXGqsqTtK4Y0%26z%3Dq%26a%3D2474a-jTkLVJbT%253DTw7V11KCUpOIR; fd27248cb7b4d7d2f46111a6f4cff229=de94c24bdffe0ae0d7361ae406b2a223; F8eh4Hwq=A8EUo3WCAQAALEwVFvOfh4nabsCKq4o7FdvXgaicvAoeGYHk8M03twyvD_L_AZkDo-icuG46wH8AAEB3AAAAAA; AMCV_664516D751E565010A490D4C%40AdobeOrg=1585540135%7CMCIDTS%7C19212%7CMCMID%7C03988130148958379533973243981058894801%7CMCAID%7CNONE%7CMCOPTOUT-1659874961s%7CNONE%7CMCAAMLH-1660472561%7C11%7CMCAAMB-1660472561%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CMCSYNCSOP%7C411-19219%7CvVersion%7C4.4.0; check=true; mbox=PC#4d19a41728fa4cd2afa965a49c3080f5.32_0#1723112561|session#357f6c2f7632496cb5dc2c11ed675a90#1659869618; ctBannerCounter=1; ctLastSessionID=1D2BA23B-0EBC-57E0-9A05-4B013AB2C998; 855f89e12f62018a955cfa5e05012eda=d589917cba4e0f888fc2eeef9be56e97; RT="z=1&dm=marriott.com.cn&si=127645d1-252d-421a-83a4-f155ef54a271&ss=l6j6egky&sl=0&tt=0&bcn=%2F%2F17de4c12.akstat.io%2F&ul=158b5"; AMCVS_664516D751E565010A490D4C%40AdobeOrg=1; mdLogger=false; kampyle_userid=499c-27a3-78fe-2d3d-1cf7-cece-67cf-6d66; kampyleUserSession=1659832561906; kampyleSessionPageCounter=5; kampyleUserSessionsCount=3; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Aug+07+2022+18%3A22%3A40+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&version=6.26.0&isIABGlobal=false&hosts=&consentId=a41d1bfd-8a4e-46f9-a4fd-0990ccc00da9&interactionCount=2&landingPath=NotLandingPage&groups=1%3A1%2C3%3A0%2C4%3A0%2C6%3A1&AwaitingReconsent=false&geolocation=CN%3B; _cls_v=8eb847c5-1363-4ff6-b91c-658f32df386d; _cls_s=b34984cf-b7d8-4944-87ec-44aa06caa8b7:0; s_tbm1=true; s_cc=true; aam_uuid=04273521383246431763982677999560041912; demdex=04273521383246431763982677999560041912; akacd_Hybrid=3837283813~rv=66~id=30014ea62f4f7db7454c1ebf37bb3e5d; akacd_RWASP-default-phased-release=3837283813~rv=78~id=91f0005f4c9bb0f6950460a3c085cc5a; at_check=true; OptanonAlertBoxClosed=2022-08-07T00:10:17.363Z; SECKEY_ABVK=hF4qj+mx8AZ9DvpFwQSvrHpPK/OdM52akNHGfArIBPM%3D; 510658a4ae9addc5e67b55f9313cbbd4=22410824fe9bab53f94aed3010a9856d; BMAP_SECKEY=cRDazFQYzYJY6sOHAVahfyQfulSYkKC4hlh8J5NolaNq8ICpSbHAZiAIcnAQCtK4fv_m_-_k0D9XRjRimrmDhHfXo1YUUUXcVEbnbNKBRuiUgJUaPU1hp2RTj5nXZrlcGUUMuEVcuuKrZW_VpyaH9aMvio7OBfqjG1XwY8QibCX85mgHxkntwvKzm289SyCy; lastUserEvent={"id":"","class":"analytics-click js-is-roomkey-enabled m-button m-button-primary ","text":" æ¥æ¾éåº ","dataAttr":{"analytics":"{'location':'searchForm'}"},"event_type":"click","event_data":{"timeStamp":35004237,"metaKey":false,"namespace":"","pageX":954,"pageY":256}}; s_sq=%5B%5BB%5D%5D; updatedSearchType=typed; kampyleUserPercentile=22.43217745886036; sessionID=1D2BA23B-0EBC-57E0-9A05-4B013AB2C998; AKA_A2=A; ak_bmsc=BAECCB4FE7BEC206B6B06C1FE66FDF10~000000000000000000000000000000~YAAQ9RTSPLzL+2WCAQAAwOTTdxApSmXOc2wx3KI9AxJn0hgXkAAyfR0DInF7tHy/X8Uh0HzeDbAgC0uxcCoYXrtrj8dqMjYGJ+7z8HbcoVe0iFkfnQurFZsaTOLUzyYDXMFv/8JJn5W5B/qVu7rirRuC+R8B4ykQOfFA+7Rr7R+0TyK+UOgK673NwzofT08NDMDFayIKuDTzTW0vGsB2h6tk70gJW649CV5P4fqhp3j3X3jjnOY4Z1n1YbBD5tcF7InO6x/9Xqhddv1rzYg3+umOrrcBVq0d79vp6Rf5wKwx+FPtq7NlmBdZnmFv58gPw9cLcEB6du+rWFW/K8aJsOds3lGZhgK+XGsZgh3x/5zXCklHhujqhSvn6e37XTlVIOpudWXK5YJKciwiCu8N; tntId=DFCBBB33-7B45-52A2-BFF3-0E8BA8B178CE.34_0; bm_mi=BCDF8898F77A301560D4BEE5C071DA8A~YAAQ9RTSPNfL+2WCAQAAXe/TdxAWOzhKazjA3zexCsng7cv4xumT+6FknOedpvu2hDljBMKJy0fFlFfGJYDaNb+DMptFyCgJzrxIG4ul2mXJRoC7r11Iws53BA22RZNMq8bI0t/J7qh2EpAD9flOEj7h7U3GxwaoAZhj8FlIjLgrVr8glNZ69OxnH/GovAUcm1h6k54aLdAGoJqzV7C43O+4v2Z0WtKxf9AZ3H7xPStDQBOduWGQOpOMMwH/iclpabsUTVVA/Kn/j/hAyv6LZCpIbU5tMp9uOtAQp/AwkQiz5ZsN/C/BbTX5dpXAEVhqwjaXT1NAvPxdyAgYLegD1yCLQIrtCZM=~1; bm_sv=B86536AB1C6CEC688784CA57E4AD4D93~YAAQ9RTSPJ7k+2WCAQAAcwjvdxDKArk7aSzsuqFeDx23nut4mVBYM6KSX6GgpzUhYTt4YBSoo+sV1pPRgTObQ8778R4wuYo/nUtBoBwQl1NFr/Li5nuCu1TtEJzlHLfI3GtHAo1sDNkDfO0rHnSeeXH9w/GIXDup1nYciKDyRJXTNEsIFjuVDFuWJYR1sS1+RNeOR/CTx34gGG95S3fx8yfJnHYQmcuHg23A/uALyinlne99ieKKahSifsUX59xjlFAG6sc=~1; 54101a7964dcdb9dcb7d4ee99752c5ea=19a21be2d371c194602b836c74ca17c2`;

async function getWanHaoHotel(date: number) {
  const fromDate = dayjs(date).format('YYYY-MM-DD');
  const toDate = dayjs(date).add(1, 'day').format('YYYY-MM-DD');
  const url = `https://www.marriott.com.cn/search/submitSearch.mi?roomTypeCode=%2C&destinationAddress.region=&recordsPerPage=50&autoSuggestItemType=&destinationAddress.types=locality%2Cpolitical&destinationAddress.latitude=36.0662299&propertyCode=%2C&destinationAddress.stateProvinceShort=&isInternalSearch=true&destinationAddress.cityPopulation=&vsInitialRequest=false&searchType=InCity&destinationAddress.locality=&showAddressPin=&miniStoreFormSubmit=&destinationAddress.stateProvinceDisplayName=&destinationAddress.destinationPageDestinationAddress=&destinationAddress.stateProvince=%E5%B1%B1%E4%B8%9C%E7%9C%81&searchRadius=80467.2&singleSearchAutoSuggest=&destinationAddress.placeId=ChIJa_D4gtUPljUR8_JMYfqCTWE&is-hotelsnearme-clicked=false&destinationAddress.addressline1=&for-hotels-nearme=%E9%9D%A0%E8%BF%91&suggestionsPropertyCode=&pageType=editsearch&destinationAddress.country=CN&destinationAddress.name=&poiCity=&destinationAddress.countryShort=&poiName=&destinationAddress.address=%E4%B8%AD%E5%9B%BD%E5%B1%B1%E4%B8%9C%E7%9C%81%E9%9D%92%E5%B2%9B%E5%B8%82&search-countryRegion=&collapseAccordian=is-hidden&singleSearch=true&destinationAddress.cityPopulationDensity=&destinationAddress.secondaryText=Shandong%2C+China&destinationAddress.postalCode=&destinationAddress.city=%E9%9D%92%E5%B2%9B%E5%B8%82&destinationAddress.mainText=Qingdao&airportCode=&isTransient=true&destinationAddress.longitude=120.38299&initialRequest=false&destinationAddress.website=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D%25E4%25B8%25AD%25E5%259B%25BD%25E5%25B1%25B1%25E4%25B8%259C%25E7%259C%2581%25E9%259D%2592%25E5%25B2%259B%25E5%25B8%2582%26ftid%3D0x35960fd582f8f06b%3A0x614d82fa614cf2f3&search-locality=&dimensions=0&keywords=&flexibleDateSearchRateDisplay=false&propertyName=&isSearch=true&marriottRewardsNumber=&isRateCalendar=false&incentiveType_Number=&incentiveType=&flexibleDateLowestRateMonth=&flexibleDateLowestRateDate=&marrOfferId=&isMultiRateSearch=&multiRateMaxCount=&multiRateCorpCodes=&useMultiRateRewardsPoints=&multiRateClusterCodes=&multiRateCorpCodesEntered=&lowestRegularRate=&js-location-nearme-values=&destinationAddress.destination=Qingdao%2C+Shandong%2C+China&fromToDate=${fromDate}&fromToDate_submit=${toDate}&fromDate=${fromDate}&toDate=${toDate}&toDateDefaultFormat=08%2F08%2F2022&fromDateDefaultFormat=08%2F07%2F2022&flexibleDateSearch=false&isHideFlexibleDateCalendar=false&t-start=2022-08-07&t-end=2022-08-08&lengthOfStay=1&roomCountBox=1+%E5%AE%A2%E6%88%BF&roomCount=1&guestCountBox=1+%E6%88%90%E4%BA%BA+%E6%AF%8F%E9%97%B4%E5%AE%A2%E6%88%BF&numAdultsPerRoom=1&childrenCountBox=0+%E5%84%BF%E7%AB%A5+%E6%AF%8F%E9%97%B4%E5%AE%A2%E6%88%BF&childrenCount=0&childrenAges=&clusterCode=none&corporateCode=`;
  const res = await fetch(url, {
    // @ts-ignore
    credentials: 'include',
    headers: {
      Cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
      'Upgrade-Insecure-Requests': '1',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
    referrer: 'https://www.marriott.com.cn/search/findHotels.mi',
    method: 'GET',
    mode: 'cors',
  });
  const text = await res.text();
  const dom = new JSDOM(text);
  const hotelList = [...dom.window.document.querySelectorAll('.l-row.wb-pos-relative')].map((pos) => {
    const name = [...pos.querySelectorAll('.js-hotel-name')].map((d) => d.textContent?.replace(/[\s]/g, '')).join(';');
    const price = pos.querySelector('.price-night .t-price')?.textContent || '';
    return { date: fromDate, name, price, type: '万豪' };
  });
  return hotelList;
  // fs.writeFileSync('./data/text.html', text);
  // console.log(text);
}
const Cookie2 = `_abck=1649BE1D52B2065E376DBB5E85354078~-1~YAAQshbSPEcBFGOCAQAAeIgXeAjpS+kOV5Uj6ZIogJTJl/f74XI5D3UUT5H0fCUKAJM9xQ/2WrdbvObd/agYJ21XLmrJB2UqtUCcfS2bf0+R9eZrg9u3UlY/n1h41UMeasy9kxyaVZxlM9m416L8TcKhEhRvkRnnfglppISjynDFsR75hje77sfwdUvXCoFBKUeubNtoXKpL1QR4dl9ruGjel5bgI4ulKqBXO8Q89q9vchViqtJetUfANO60C4+Cq/5gzt/ewx9eiIh1a44bwgG+FRBzZhLu3QtIVrrgA5wmNI6h+WSCOI6v62ZeMiMxXySGTbMVi+HXxdExNn9d2kmlHT3qlJbONRdwYgYCUnb0xeYlJWM4PUrv9K8JchVb~-1~-1~-1; ensUID=219215410nFyzV1ZWMeH; AMCV_8EAD67C25245B1870A490D4C%40AdobeOrg=1585540135%7CMCIDTS%7C19212%7CMCMID%7C08728097569227601181307492753561784175%7CMCAID%7CNONE%7CMCOPTOUT-1659865306s%7CNONE%7CMCAAMLH-1660462906%7C11%7CMCAAMB-1660462906%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CvVersion%7C4.4.0; check=true; mbox=PC#b6b7a18a7e354ced8507ba279770a940.32_0#1723102907|session#4cdcbc6f90f846638420505e992b20cd#1659874043; AMCVS_8EAD67C25245B1870A490D4C%40AdobeOrg=1; gig_bootstrap_4_jpzahMO4CBnl9Elopzfr0A=identity_ver4; notice_behavior=implied,eu; aam_uuid=08925308939528653651322680038034608268; userGuid=4e37f330-c606-4205-96e9-3f485aa605b8; ADRUM=s=1659872180503&r=https%3A%2F%2Fwww.ihg.com.cn%2Fhotels%2Fcn%2Fzh%2Ffind-hotels%2Fhotel%2Flist%3F1490238170; roomKeyCookie=1659858276; CopterConnect=B229BB78-65EB-4128-9562-6BEC44A1811F%7Cae020d407073c7e711f5649ef9844ec4%7CIHGRoomkeypop; notice_preferences=3:; notice_gdpr_prefs=0,1,2,3:; notice_poptime=1657720800000; cmapi_gtm_bl=; cmapi_cookie_privacy=permit 1,2,3,4; _uetsid=886b3d30162411ed9de26b91efa237a1; _uetvid=886b40a0162411edba79a99148b34992; ak_bmsc=F0EC720DDDB51FAEB41FC59C1ED8B01B~000000000000000000000000000000~YAAQJRTSPM4ez2eCAQAAfxoBeBDBGXBzy0Eb+X+Y3o2tQKch/itldgm1vqJxG++DqYQpuSGfUKeYHQKLZO1kijPQv13icKBHLjb5HsM8c8DcPovl7um3RcmaDnDs3U29v0cmVkBOhi4w4RnzyjoOqviFUQhbkids9krfG9G3Ay8MZuC/23EVYLlsVGnkldDcFTsBpW0SPf2khZpQmBUuFUdpF1/Zr1rBvbIVS6F+1E+VS76mj+hXwcXR2Q0rrKaxm33K5FF/Nzq609nRde33x83VOAOaBEd2mraTSJ3DZmgjRJjzWO83uqxKuf/7WN1e9Zua+f1TF97NKK8my/7iHIEEevd3K9crAaeJ9nWrrYDJ6BxrgNZK4EVD7j8fKTtKVtAKpW7TWAo7Gw==; bm_sz=E2CF9864E0AC47B544CD53F641332208~YAAQJRTSPM8ez2eCAQAAfxoBeBBXseegvJbMBRfc/+gmg18/KGbocKDDuEbjSmbOEfnbh8FlrYfne16p8baRC7rNlo6/XFUbFcOBBZdK29j2EoZaLoNie+WOIhvSkZEARijqy3DXkPR9WXzGsB3eTSP37JVSVvmYbHKzAV8DWQ2r34sR4nN3uWhoYOs1K1sKY3bk9ein9Z6khrvkKt1T4o1vBjzJmRW+wAem905DWqHXgnhuqBZ3GPa5MvmJjP/mS+t1GiKJqLYwBeddwOBPifsh3+jaChiT51ejaHKLz34A3/c=~4470593~4474421; bm_sv=90791B74F74468DEE457B65699482E88~YAAQbZ7C3fVo6GGCAQAAvIQXeBB5Yz3XlLttaagmqvZCeaK3Jvo0kd9AvMzayW1vX5kqO20LayoNrNw2H/u+ODL6Qr3CTALWFknFfNoKYTh29Q+vOGJ4/kanWqaVH7i3f645a98HaOBxliHp8zT32DHzvcxr3EWlXVrYRRou1I5s1XuE960yCIE7fpt0+asU8nWYqHbhD5mxAxrTqVak3r72eH+MZC+KcU9yYFRdtEQ5EsgAQtTn2uQp1cw+HsdI~1; ADRUM_BTa=R:23|g:e9465626-d82f-4593-9841-4da84bda1bea|n:ihg-prod_b3f2c515-18e4-4179-bf89-bc1bae74cb38; SameSite=None; ADRUM_BT1=R:23|i:417428|e:486`;
const Cookie3 = `roomKeyCookie=1659858101; CopterConnect=B229BB78-65EB-4128-9562-6BEC44A1811F%7Cae020d407073c7e711f5649ef9844ec4%7CIHGRoomkeypop; _abck=1649BE1D52B2065E376DBB5E85354078~-1~YAAQbZ7C3UNp6GGCAQAABY4XeAi/9SEaE9F3I1MpNH8aRn597hH/0dnXkO9jWgFcsUO8A5P/hUmIZoPmyewzKTbMJlaGJ94Fl/OlbPbYSCKoUIdI887gIyl0toHzXjyqiN5FFXUUftcXs9N5RnOizmeZhKAgXJHOdD2FsqcMnIBKceyLV8gkX1ClzNZW2Hv0HSMWap6JJAHUEx2LmPQacGhro69QpcWlah+oN6v+Kfbw29K9IodDAVdYv9FeRs8Q/rsMyBw9eH2dfsrbcaLhu1AyS0jwLtKbHZHUmZ5ovZQ3eWF9Dh3rnOoH+O55ld0q8MoO8/kkjR5JLiIskbdt7c5/azg8BLsLmu2DDqaSUXUy2gsWYBZ1xnJvcTv4PSSpJ6hn7DouEnM54q8=~-1~-1~-1; ensUID=219215410nFyzV1ZWMeH; AMCV_8EAD67C25245B1870A490D4C%40AdobeOrg=1585540135%7CMCIDTS%7C19212%7CMCMID%7C08728097569227601181307492753561784175%7CMCAID%7CNONE%7CMCOPTOUT-1659865306s%7CNONE%7CMCAAMLH-1660462906%7C11%7CMCAAMB-1660462906%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CvVersion%7C4.4.0; check=true; mbox=PC#b6b7a18a7e354ced8507ba279770a940.32_0#1723102907|session#4cdcbc6f90f846638420505e992b20cd#1659874043; AMCVS_8EAD67C25245B1870A490D4C%40AdobeOrg=1; gig_bootstrap_4_jpzahMO4CBnl9Elopzfr0A=identity_ver4; notice_behavior=implied,eu; aam_uuid=08925308939528653651322680038034608268; userGuid=4e37f330-c606-4205-96e9-3f485aa605b8; ADRUM=s=1659872180503&r=https%3A%2F%2Fwww.ihg.com.cn%2Fhotels%2Fcn%2Fzh%2Ffind-hotels%2Fhotel%2Flist%3F1490238170; roomKeyCookie=1659858276; CopterConnect=B229BB78-65EB-4128-9562-6BEC44A1811F%7Cae020d407073c7e711f5649ef9844ec4%7CIHGRoomkeypop; notice_preferences=3:; notice_gdpr_prefs=0,1,2,3:; notice_poptime=1657720800000; cmapi_gtm_bl=; cmapi_cookie_privacy=permit 1,2,3,4; _uetsid=886b3d30162411ed9de26b91efa237a1; _uetvid=886b40a0162411edba79a99148b34992; ak_bmsc=F0EC720DDDB51FAEB41FC59C1ED8B01B~000000000000000000000000000000~YAAQJRTSPM4ez2eCAQAAfxoBeBDBGXBzy0Eb+X+Y3o2tQKch/itldgm1vqJxG++DqYQpuSGfUKeYHQKLZO1kijPQv13icKBHLjb5HsM8c8DcPovl7um3RcmaDnDs3U29v0cmVkBOhi4w4RnzyjoOqviFUQhbkids9krfG9G3Ay8MZuC/23EVYLlsVGnkldDcFTsBpW0SPf2khZpQmBUuFUdpF1/Zr1rBvbIVS6F+1E+VS76mj+hXwcXR2Q0rrKaxm33K5FF/Nzq609nRde33x83VOAOaBEd2mraTSJ3DZmgjRJjzWO83uqxKuf/7WN1e9Zua+f1TF97NKK8my/7iHIEEevd3K9crAaeJ9nWrrYDJ6BxrgNZK4EVD7j8fKTtKVtAKpW7TWAo7Gw==; bm_sz=E2CF9864E0AC47B544CD53F641332208~YAAQJRTSPM8ez2eCAQAAfxoBeBBXseegvJbMBRfc/+gmg18/KGbocKDDuEbjSmbOEfnbh8FlrYfne16p8baRC7rNlo6/XFUbFcOBBZdK29j2EoZaLoNie+WOIhvSkZEARijqy3DXkPR9WXzGsB3eTSP37JVSVvmYbHKzAV8DWQ2r34sR4nN3uWhoYOs1K1sKY3bk9ein9Z6khrvkKt1T4o1vBjzJmRW+wAem905DWqHXgnhuqBZ3GPa5MvmJjP/mS+t1GiKJqLYwBeddwOBPifsh3+jaChiT51ejaHKLz34A3/c=~4470593~4474421; bm_sv=90791B74F74468DEE457B65699482E88~YAAQbZ7C3URp6GGCAQAABY4XeBBRO33qH0i10HXHSisOLXY66uWxK/S+2Y9bg0fiday61CMEKpREgds8F25CYQ3IrtHPEeQCVZx9eVN/AByWdmdJOJY+OfprJz2X8V9HtHFd5ee9JxwtyRwr86spuvmsbkWw43CaarXjLNNSd0rnMuz2Alrm5QGJQaj6VHVYM6gD9QXpn2Wl4KLP5Yga4ddv3HSZRowTaea25DOp+wzcYgHPUDoScORprzrQMI9K~1; ADRUM_BTa=R:23|g:015a0399-8ea7-48b5-8b83-cd268c8fc030|n:ihg-prod_b3f2c515-18e4-4179-bf89-bc1bae74cb38; SameSite=None; ADRUM_BT1=R:23|i:417432|e:327; gig3pctest=true`;
async function getWanZhou(date: number) {
  const fromDate = dayjs(date).format('YYYY-MM-DD');
  const toDate = dayjs(date).add(1, 'day').format('YYYY-MM-DD');
  const body = {
    products: [
      {
        productCode: 'SR',
        guestCounts: [
          { otaCode: 'AQC10', count: 1 },
          { otaCode: 'AQC8', count: 0 },
        ],
        startDate: fromDate,
        endDate: toDate,
        quantity: 1,
      },
    ],
    radius: 30,
    distanceUnit: 'MI',
    distanceType: 'STRAIGHT_LINE',
    startDate: fromDate,
    endDate: toDate,
    geoLocation: [{ latitude: 36.266818, longitude: 120.386023 }],
    rates: { ratePlanCodes: [] },
  };
  const res = await fetch('https://apis.ihg.com.cn/availability/v3/hotels/offers?fieldset=summary,summary.rateRanges', {
    // @ts-ignore
    credentials: 'include',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
      'Content-Type': 'application/json; charset=UTF-8',
      'x-ihg-api-key': 'pQM1YazQwnWi5AWXmoRoA5FSfW0S9x8A',
      'ihg-language': 'en-US',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      Cookie: Cookie2,
    },
    referrer: 'https://www.ihg.com.cn/',
    body: JSON.stringify(body),
    method: 'POST',
    mode: 'cors',
  });
  const searchData = (await res.json()) as SearchData;
  const re = [];
  for (const hotel of searchData.hotels) {
    const id = hotel.hotelMnemonic;
    const price = hotel.lowestCashOnlyCost?.baseAmount || 0;
    const res = await fetch(
      `https://apis.ihg.com.cn/hotels/v1/profiles/${id}/details?fieldset=brandInfo,reviews,mediaCategories,location,tax,parking,facilities,profile,address,contact,renovationAlerts.active,stripes,policies,marketing`,
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json; charset=UTF-8',
          'ihg-language': 'zh-CN',
          'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-ihg-api-key': 'pQM1YazQwnWi5AWXmoRoA5FSfW0S9x8A',
          Referer: 'https://www.ihg.com.cn/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
      }
    );
    const detailData = (await res.json()) as DetailData;
    const name = detailData.hotelInfo.profile.name;
    re.push({ date: fromDate, name, price, type: '万州' });
  }
  return re;
}

(async () => {
  // const data = await getWanZhou(dayjs().valueOf());
  // console.log(data);
  for (let index = 0; index < 31; index++) {
    const hotelList = await getWanHaoHotel(dayjs().add(index, 'day').valueOf());
    const hotelList2 = await getWanZhou(dayjs().add(index, 'day').valueOf());
    console.log('get', dayjs().add(index, 'day').format('YYYY-MM-DD'));
    await delay(5 * 1000);
    writeCsv('./ho.csv', [...hotelList, ...hotelList2]);
  }
})();
