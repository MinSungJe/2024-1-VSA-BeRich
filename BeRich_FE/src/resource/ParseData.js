// 라인그래프용 데이터 정제
export const processLineData = (data) => {
    return data.map((item, index) => ({
        y: item.Close,
        timestamp: item.timestamp
    }))
}

// 캔들그래프용 데이터 정제
export const processCandleData = (data) => {
    return data.map(item => ({
        shadowH: item.High,
        shadowL: item.Low,
        open: item.Open,
        close: item.Close,
        timestamp: item.timestamp
    }));
};

// x축 레이블에 사용할 시간 포맷 함수
export const dateFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}`; // MM-DD 포맷
};

export const dateTimeFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}-${(date.getHours()).toString().padStart(2, "0")}`; // MM-DD-hh 포맷
};