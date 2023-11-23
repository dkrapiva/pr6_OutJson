function formData(arr_size, arr_time){
    let ag_data = new Map();
    for (let i = 0; i < arr_time.length; i++){
        if (!ag_data.get(arr_size[i])) {
            ag_data.set(arr_size[i], []);
        } 
        ag_data.get(arr_size[i]).push(arr_time[i]);
    }

    let res_size = [];
    let res_time = [];
    for (let item of ag_data) {
        res_size.push(Number(item[0])); // ключ
        res_time.push(getAverage(item[1])); // среднее значение
    }
    console.log(res_size);
    console.log(res_time);
    return [res_size, res_time];
}

// getAverage: считает среднее значений массива
const getAverage = (numbers) => {
    let sum = 0; 
    for (let i = 0; i < numbers.length; i += 1) { 
      sum += parseFloat(numbers[i]); 
    }
    return sum / numbers.length; 
}