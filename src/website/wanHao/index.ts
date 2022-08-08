import fetch from 'node-fetch';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import { SearchData, DetailData } from './type';
import { writeCsv } from '@/fs';
import { delay } from '@/utils';
import cookie from 'cookie';
import puppeteer from 'puppeteer-core';

async function getWanHaoCookie() {
  const res = await fetch('https://www.marriott.com.cn/default.mi', {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      Referer: 'https://www.marriott.com.cn/default.mi',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: null,
    method: 'GET',
  });
  return res.headers.raw()['set-cookie'].map((co) => {
    const _co = cookie.parse(co);
    return _co;
  });
}

async function getWanHaoHotel(date: number) {
  const fromDate = dayjs(date).format('YYYY-MM-DD');
  const toDate = dayjs(date).add(1, 'day').format('YYYY-MM-DD');
  console.log(fromDate, toDate);
  const url = `https://www.marriott.com.cn/search/submitSearch.mi?roomTypeCode=%2C&destinationAddress.region=&recordsPerPage=50&autoSuggestItemType=&destinationAddress.types=locality%2Cpolitical&destinationAddress.latitude=36.0662299&propertyCode=%2C&destinationAddress.stateProvinceShort=&isInternalSearch=true&destinationAddress.cityPopulation=&vsInitialRequest=false&searchType=InCity&destinationAddress.locality=&showAddressPin=&miniStoreFormSubmit=&destinationAddress.stateProvinceDisplayName=&destinationAddress.destinationPageDestinationAddress=&destinationAddress.stateProvince=%E5%B1%B1%E4%B8%9C%E7%9C%81&searchRadius=80467.2&singleSearchAutoSuggest=&destinationAddress.placeId=ChIJa_D4gtUPljUR8_JMYfqCTWE&is-hotelsnearme-clicked=false&destinationAddress.addressline1=&for-hotels-nearme=%E9%9D%A0%E8%BF%91&suggestionsPropertyCode=&pageType=editsearch&destinationAddress.country=CN&destinationAddress.name=&poiCity=&destinationAddress.countryShort=&poiName=&destinationAddress.address=%E4%B8%AD%E5%9B%BD%E5%B1%B1%E4%B8%9C%E7%9C%81%E9%9D%92%E5%B2%9B%E5%B8%82&search-countryRegion=&collapseAccordian=is-hidden&singleSearch=true&destinationAddress.cityPopulationDensity=&destinationAddress.secondaryText=Shandong%2C+China&destinationAddress.postalCode=&destinationAddress.city=%E9%9D%92%E5%B2%9B%E5%B8%82&destinationAddress.mainText=Qingdao&airportCode=&isTransient=true&destinationAddress.longitude=120.38299&initialRequest=false&destinationAddress.website=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D%25E4%25B8%25AD%25E5%259B%25BD%25E5%25B1%25B1%25E4%25B8%259C%25E7%259C%2581%25E9%259D%2592%25E5%25B2%259B%25E5%25B8%2582%26ftid%3D0x35960fd582f8f06b%3A0x614d82fa614cf2f3&search-locality=&dimensions=0&keywords=&flexibleDateSearchRateDisplay=false&propertyName=&isSearch=true&marriottRewardsNumber=&isRateCalendar=false&incentiveType_Number=&incentiveType=&flexibleDateLowestRateMonth=&flexibleDateLowestRateDate=&marrOfferId=&isMultiRateSearch=&multiRateMaxCount=&multiRateCorpCodes=&useMultiRateRewardsPoints=&multiRateClusterCodes=&multiRateCorpCodesEntered=&lowestRegularRate=&js-location-nearme-values=&destinationAddress.destination=Qingdao%2C+Shandong%2C+China&fromToDate=${fromDate}&fromToDate_submit=${toDate}&fromDate=${fromDate}&toDate=${toDate}&toDateDefaultFormat=08%2F08%2F2022&fromDateDefaultFormat=08%2F07%2F2022&flexibleDateSearch=false&isHideFlexibleDateCalendar=false&t-start=2022-08-07&t-end=2022-08-08&lengthOfStay=1&roomCountBox=1+%E5%AE%A2%E6%88%BF&roomCount=1&guestCountBox=1+%E6%88%90%E4%BA%BA+%E6%AF%8F%E9%97%B4%E5%AE%A2%E6%88%BF&numAdultsPerRoom=1&childrenCountBox=0+%E5%84%BF%E7%AB%A5+%E6%AF%8F%E9%97%B4%E5%AE%A2%E6%88%BF&childrenCount=0&childrenAges=&clusterCode=none&corporateCode=`;
  const res = await fetch(url, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      Referer: 'https://www.marriott.com.cn/default.mi',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: null,
    method: 'GET',
  });
  console.log(res.headers);

  const text = await res.text();
  fs.writeFileSync('./data/2.html', text);
  const dom = new JSDOM(text);
  const hotelList = [...dom.window.document.querySelectorAll('.l-row.wb-pos-relative')].map((pos) => {
    const name = [...pos.querySelectorAll('.js-hotel-name')].map((d) => d.textContent?.replace(/[\s]/g, '')).join(';');
    const price = pos.querySelector('.price-night .t-price')?.textContent || '';
    const id =
      new URL(pos.querySelector('.js-hotel-quickview-link')?.textContent || '', 'http://a.com').searchParams.get('propertyId') || '';
    return { date: fromDate, name, price, type: '万豪', id };
  });
  console.log(hotelList);
  for (const hotel of hotelList) {
    const res = await fetch(
      `https://www.marriott.com.cn/reservation/availabilitySearch.mi?isSearch=true&propertyCode=${hotel.id}&currency=&roomTypeCode=room`,
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'zh-CN,zh;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          cookie:
            'SECKEY_ABVK=8nXW5kOn5p+Z05KoolZ6/J0GNEV6lm8QuobycKlj4K0%3D; BMAP_SECKEY=OvSZi-ZcNoIPaaXJS4LIyzhAOkcif-7O-yRck9EAqMwHSF9MxfIs-W7ld2nvQv9c7K8ZjE1GCFlDUCr5mJaSj1qehckC1MhXSM0E9oLT8jOr4fisLgktt3KQgbZlpSs0w0x4-4D2FRnhbEMCDauK7Gkce17aT1ddpJjGbmPG9o0DBkaPawKdC83tSRMzroyr; sessionID=AC3F59D4-52CD-57A8-A139-CF7234065947; MI_Visitor=AC3F59D4-52CD-57A8-A139-CF7234065947; MI_SITE=prod13; x-mi-tag=rel-R22.8.1; 48e12f862218573e03bad597af586e4a=4629c8c524d2e2f8ba51a70b7c7caef8; AKA_A2=A; 9bcb0189543e0c57619675a1e489dad6=27a59bc5863f433f6f885bc12f0a6f13; akacd_wwwprodcnfirst=3837373252~rv=94~id=7087576cfc02e286f3f7382907c6d22b; ak_bmsc=016B21044CB9EC9D75A963019BF3A069~000000000000000000000000000000~YAAQvArgesxeFWKCAQAAbxH4ehBh3UiQoiVX8RoFruiE+gNX6BBIWGQ7xImIxYONcjJ3+bkmGc/G6rYFwxStgmzDDAODUgT+M0B1BKAR0Z1Tg/FcrUxtw+BAgOaR57QiSDAOHyHraOkFvPaPe1kiE6eZqHWbGY8c9MqDVL+z7qm7YPodGbShBfyF8t/iLKNcdLdrpJ2YoGlYWbCrESKNv5IAHeutB70dXkQfMvJonrem9jfBHfPG0otRNZlHTWUhqIb/0hAR5MJ+xTNvouQ2FES7bhJW8Ci40awzC6gSUG9K0acPlf/15YwIm0PkAvVPuMYnpuYgpKNG1T/ylGmhqWD3zk1jwd9Nn4DHpGUZMikViILot1Nc3/BiCKI6uN8W9STDrXQHBTxv8dr+hJl+; e37a5a7b342e64476a0b7920f4e28414=b678780231752252e583b312400d09fe; ctLastSessionID=AC3F59D4-52CD-57A8-A139-CF7234065947; F8eh4Hwq=A5hc-XqCAQAA_2QvtpHpzxDibPrbNTr2ZyOqsfXLltifb3emzmOviBCc4YzLAXVZgxKuci7ywH8AAEB3AAAAAA; ZMz286iJ=f%3DA2dt-XqCAQAAjt4X_BHl7nPMSQ8y21Vdov3OEoyWSjIrqqwbG1cfYQ46a_sGAXVZgxKuci7ywH8AAEB3AAAAAA%253D%253D%26b%3D-a9r562%26c%3DAIA-93qCAQAA_jJxh5yFCdngg92lxoAUAfBHkHmQAyfRXkBNM71-vThwfQB4%26d%3DABYAgACAAIAAgACAAQC9fr04cH0AeAAAAABrKlY4AKb24mVgj-goUC4H1g9EFYE%26z%3Dq%26a%3DfmT7zAxn3l_-rUzuVTznqbGS_L-L; ctBannerCounter=2; 855f89e12f62018a955cfa5e05012eda=addc32f2d59343e1f149e3d4db16158a; 7f43ca11c4dc21bb60196804ca3a8e4a=0ae38c88e0eb8797322e5eec65d38017; JVMID=aries-play-search-app-green-15-xpz9x; fd27248cb7b4d7d2f46111a6f4cff229=d00e903a9b39e4407ce3ef3ecfdbb180; bm_mi=EDE321518CE76F7922EC9BF664E0F0AF~YAAQvArgejN+FWKCAQAAocL5ehDiASdY5FvsRrZjZDnvTgj58IVHI66Opaf4fXd3UCvV4uoBpnJ/ziKKH/1iLNIrh/i+LoQ63A5kt+FXMKwXhUuGBJNCC1mjiI6+XiG1y2V6W72EH7TwhnlJxfiH3eRzMMLZ1oq3Y61RPFcx2sBK8H4lwoFQfmGldMPtLFMLbdkO1eOFErA+vvL8rm7uZAmscsVJJngkAGbSq1zJkkKMOwgoJHCjbBRATyZOQUMQvfzzgDnsS1mFZ9VhfAo3phlyrygPqh7Ccz5uyV7dkMzIwhj4mTSYT5mc70KGUg0b/uPyaQb3j0bhuYHY2pVEQpPs8zmn1mNvaNjb~1; bm_sv=51A060D92B1B0CD768775789DDEFDB5F~YAAQvArgejR+FWKCAQAAocL5ehD85B+sdr5Ad+J5NCb8XH8sc6sX1OpsDzSGC6NoGDaOYZkpMiTcrd6geNPyq7BLX1eN10PrORIYihpfLSo8msEhxYI5cezz8NqbZMnLTreduSzwnKYR+6L8nCEkSSe9NLp+A+3snZMJbm8dAJ6y7zpXarOoi7qSiGncjPZl8nEcXHGis9FHta9LMaV2OoG+pTjJeoy9C7qTZItpjQgGfJRF3KKgh6bT1KGml6WYjZehjfU=~1; lastUserEvent={"id":"","class":"check-rates-link m-button m-button-primary","text":"æˆ¿é—´è¯¦æƒ…","dataAttr":{},"event_type":"click","event_data":{"timeStamp":41241.700000047684,"metaKey":false,"namespace":"","pageX":552,"pageY":855}}; RT="z=1&dm=marriott.com.cn&si=2d407d6f-82fc-4bdf-b8b3-8b3cfb9edd8d&ss=l6k1hkre&sl=8&tt=yjq&bcn=%2F%2F684d0d44.akstat.io%2F&obo=1&rl=1&ld=ciat&nu=tuopnuj8&cl=d8cc&ul=d8ci"',
          Referer: 'https://www.marriott.com.cn/search/findHotels.mi',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
      }
    );
    const text = await res.text();
    fs.writeFileSync(`./data/${hotel.id}.html`, text);
  }
  return hotelList;
  // console.log(text);
}

const Cookie2 = `_abck=1649BE1D52B2065E376DBB5E85354078~-1~YAAQshbSPEcBFGOCAQAAeIgXeAjpS+kOV5Uj6ZIogJTJl/f74XI5D3UUT5H0fCUKAJM9xQ/2WrdbvObd/agYJ21XLmrJB2UqtUCcfS2bf0+R9eZrg9u3UlY/n1h41UMeasy9kxyaVZxlM9m416L8TcKhEhRvkRnnfglppISjynDFsR75hje77sfwdUvXCoFBKUeubNtoXKpL1QR4dl9ruGjel5bgI4ulKqBXO8Q89q9vchViqtJetUfANO60C4+Cq/5gzt/ewx9eiIh1a44bwgG+FRBzZhLu3QtIVrrgA5wmNI6h+WSCOI6v62ZeMiMxXySGTbMVi+HXxdExNn9d2kmlHT3qlJbONRdwYgYCUnb0xeYlJWM4PUrv9K8JchVb~-1~-1~-1; ensUID=219215410nFyzV1ZWMeH; AMCV_8EAD67C25245B1870A490D4C%40AdobeOrg=1585540135%7CMCIDTS%7C19212%7CMCMID%7C08728097569227601181307492753561784175%7CMCAID%7CNONE%7CMCOPTOUT-1659865306s%7CNONE%7CMCAAMLH-1660462906%7C11%7CMCAAMB-1660462906%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CvVersion%7C4.4.0; check=true; mbox=PC#b6b7a18a7e354ced8507ba279770a940.32_0#1723102907|session#4cdcbc6f90f846638420505e992b20cd#1659874043; AMCVS_8EAD67C25245B1870A490D4C%40AdobeOrg=1; gig_bootstrap_4_jpzahMO4CBnl9Elopzfr0A=identity_ver4; notice_behavior=implied,eu; aam_uuid=08925308939528653651322680038034608268; userGuid=4e37f330-c606-4205-96e9-3f485aa605b8; ADRUM=s=1659872180503&r=https%3A%2F%2Fwww.ihg.com.cn%2Fhotels%2Fcn%2Fzh%2Ffind-hotels%2Fhotel%2Flist%3F1490238170; roomKeyCookie=1659858276; CopterConnect=B229BB78-65EB-4128-9562-6BEC44A1811F%7Cae020d407073c7e711f5649ef9844ec4%7CIHGRoomkeypop; notice_preferences=3:; notice_gdpr_prefs=0,1,2,3:; notice_poptime=1657720800000; cmapi_gtm_bl=; cmapi_cookie_privacy=permit 1,2,3,4; _uetsid=886b3d30162411ed9de26b91efa237a1; _uetvid=886b40a0162411edba79a99148b34992; ak_bmsc=F0EC720DDDB51FAEB41FC59C1ED8B01B~000000000000000000000000000000~YAAQJRTSPM4ez2eCAQAAfxoBeBDBGXBzy0Eb+X+Y3o2tQKch/itldgm1vqJxG++DqYQpuSGfUKeYHQKLZO1kijPQv13icKBHLjb5HsM8c8DcPovl7um3RcmaDnDs3U29v0cmVkBOhi4w4RnzyjoOqviFUQhbkids9krfG9G3Ay8MZuC/23EVYLlsVGnkldDcFTsBpW0SPf2khZpQmBUuFUdpF1/Zr1rBvbIVS6F+1E+VS76mj+hXwcXR2Q0rrKaxm33K5FF/Nzq609nRde33x83VOAOaBEd2mraTSJ3DZmgjRJjzWO83uqxKuf/7WN1e9Zua+f1TF97NKK8my/7iHIEEevd3K9crAaeJ9nWrrYDJ6BxrgNZK4EVD7j8fKTtKVtAKpW7TWAo7Gw==; bm_sz=E2CF9864E0AC47B544CD53F641332208~YAAQJRTSPM8ez2eCAQAAfxoBeBBXseegvJbMBRfc/+gmg18/KGbocKDDuEbjSmbOEfnbh8FlrYfne16p8baRC7rNlo6/XFUbFcOBBZdK29j2EoZaLoNie+WOIhvSkZEARijqy3DXkPR9WXzGsB3eTSP37JVSVvmYbHKzAV8DWQ2r34sR4nN3uWhoYOs1K1sKY3bk9ein9Z6khrvkKt1T4o1vBjzJmRW+wAem905DWqHXgnhuqBZ3GPa5MvmJjP/mS+t1GiKJqLYwBeddwOBPifsh3+jaChiT51ejaHKLz34A3/c=~4470593~4474421; bm_sv=90791B74F74468DEE457B65699482E88~YAAQbZ7C3fVo6GGCAQAAvIQXeBB5Yz3XlLttaagmqvZCeaK3Jvo0kd9AvMzayW1vX5kqO20LayoNrNw2H/u+ODL6Qr3CTALWFknFfNoKYTh29Q+vOGJ4/kanWqaVH7i3f645a98HaOBxliHp8zT32DHzvcxr3EWlXVrYRRou1I5s1XuE960yCIE7fpt0+asU8nWYqHbhD5mxAxrTqVak3r72eH+MZC+KcU9yYFRdtEQ5EsgAQtTn2uQp1cw+HsdI~1; ADRUM_BTa=R:23|g:e9465626-d82f-4593-9841-4da84bda1bea|n:ihg-prod_b3f2c515-18e4-4179-bf89-bc1bae74cb38; SameSite=None; ADRUM_BT1=R:23|i:417428|e:486`;
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
  const bro = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  for (let index = 0; index < 1; index++) {
    const from = dayjs().add(index, 'day').startOf('day').valueOf();
    const to = dayjs()
      .add(index + 1, 'day')
      .startOf('day')
      .valueOf();
    const page = await bro.newPage();
    await page.goto('https://www.marriott.com.cn/default.mi', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    const input = await page.$('#searchform_copy_destination > div.search_content > input');
    await input?.type('Qingdao, Shandong, China');
    const cal = await page.$('#searchform_copy-pc-calendar .cmp-searchfilters__field-input');
    await cal?.click?.();
    await page.waitForTimeout(1000);
    console.log(`[time="${from}"]`, `[time="${to}"] a`);
    const fromB = await page.$(`#searchform_copy-pc-calendar [time="${from}"] a`);
    const toB = await page.$(`#searchform_copy-pc-calendar [time="${to}"] a`);
    await fromB?.click?.();
    await toB?.click?.();
    const sureB = await page.$(`#searchform_copy-pc-calendar .apply-btn`);
    await sureB?.click?.();
    await page.waitForTimeout(1000);
    const searchB = await page.$('#searchform_copy-cnsite-searchform .search_button');
    await searchB?.click?.();
    await page.waitForTimeout(1000);
    await page.waitForTimeout(5000);
    const hrefList = await page.$$eval('.t-price-btn', (l) => l.map((d) => d.getAttribute('href')));
    console.log(hrefList);
    for (const href of hrefList) {
      const fullHref = 'https://www.marriott.com.cn' + href;
      await page.goto(fullHref, { waitUntil: 'load' });
    }
    // const hotelList = await getWanHaoHotel(dayjs().add(index, 'day').valueOf());
    // getWanHaoCookie();
    // const hotelList2 = await getWanZhou(dayjs().add(index, 'day').valueOf());
    // console.log('get', dayjs().add(index, 'day').format('YYYY-MM-DD'));
    // await delay(5 * 1000);
    // writeCsv('./ho.csv', [...hotelList, ...hotelList2]);
  }
})();
