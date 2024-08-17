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
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}-${(date.getHours()).toString().padStart(2, "0")}`; // MM-DD-hh 포맷
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