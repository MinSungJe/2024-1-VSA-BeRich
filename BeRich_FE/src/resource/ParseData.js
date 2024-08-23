// 라인그래프용 데이터 정제
export const processLineData = (data) => {
    return data.map(item => ({
        y: item.Close,
        timestamp: item.timestamp
    }))
}

// 캔들그래프용 데이터 정제
export const processCandleData = (data) => {
    return data.map(item => ({
        shadowH: item.high,
        shadowL: item.low,
        open: item.open,
        close: item.close,
        volume: item.volume,
        timestamp: item.timestamp
    }));
};

// 라인그래프 x축 레이블에 사용할 시간 포맷 함수(MM-DD)
export const dateFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}`; // MM-DD 포맷
};

// 캔들그래프 x축 레이블에 사용할 시간 포맷 함수(MM-DD-hh)
export const dateTimeFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")} ${(date.getHours()).toString().padStart(2, "0")}시`; // MM-DD-hh 포맷
};

// Stock data의 값을 변환
export const parseStockData = (stock) => {
    if (!stock) return ''
    else return JSON.parse(stock)
}

// date -> YY-MM-DD
export function dateFormat(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let result = year + '-' + ((month < 10 ? '0' + month : month) + '-' + ((day < 10 ? '0' + day : day)));
    return result;
}

// 가장 빠른 startDay 계산
export const calculateStartDay = () => {
    let today = new Date();
    const currentDay = today.getDay(); // 0: 일요일, 6: 토요일
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinutes; // 시간을 분 단위로 계산

    // 평일 오후 2시 30분 이후인 경우 내일로 설정
    if (currentDay >= 1 && currentDay <= 5 && currentTime >= 14 * 60 + 30) {
        today.setDate(today.getDate() + 1);
    }

    // 토요일인 경우 월요일로 설정
    if (today.getDay() === 6) {
        today.setDate(today.getDate() + 2);
    }
    // 일요일인 경우 월요일로 설정
    if (today.getDay() === 0) {
        today.setDate(today.getDate() + 1);
    }

    return today;
};

// UTC+9 적용
export const convertUTCtoKST = (utcDateString) => {
    // UTC로 받은 시간 정보를 Date 객체로 변환
    const date = new Date(utcDateString);
  
    // KST로 변환하여 시간 정보를 가져옴
    const kstDate = new Date(date.getTime() + 9 * 60 * 60);
  
    // 변환된 시간을 문자열로 출력 (한국 표준시 기준)
    return kstDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  };