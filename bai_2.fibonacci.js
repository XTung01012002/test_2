function fibonacci(n) {
    let a = 0, b = 1;
    
    for (let i = 2; i <= n; i++) {
        let temp = a + b;
        a = b;
        b = temp;
    }
    
    return b;
}

console.time('timetime'); 
const result = fibonacci(100); 

console.timeEnd('timetime'); 
console.log('Fibonacci thứ 100 là:', result);
