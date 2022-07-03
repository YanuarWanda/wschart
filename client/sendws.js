const url = 'ws://127.0.0.1:4000'

let socket

window.addEventListener('load', () => {
    // Charts
    const getTime = (count) => {
        const time = new Date()
        time.setSeconds(time.getSeconds() + count)
        return time.toLocaleString();
    }

    const getRandomData = (max, min) => Number((Math.random() * (max - min) + min).toFixed(2))

    const updateData = (chart, data) => {
        const labels = chart.data.labels
        labels.push(getTime(labels.length))
        const datas = chart.data.datasets[0].data
        datas.push(data)

        if (labels.length > 10) {
            labels.shift()
            datas.shift()
        }

        chart.update()
    }

    const phChartEl = document.getElementById('phChart')
    const phChart = new Chart(phChartEl, {
        type: 'line',
        data: {
            labels: [ getTime(0), getTime(1), getTime(2), getTime(3), getTime(4) ],
            datasets: [
                {
                    label: 'Nilai pH Air',
                    data: [3.0, 3.0, 6.0, 4.0, 2.0],
                    borderColor: 'rgba(50, 115, 220, 0.5)'
                }
            ]
        },
        options: {
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: true,
                    ticks: {
                        suggestedMin: 0.0,
                        beginAtZero: true,
                        suggestedMax: 14.0
                    }
                }
            }
        }
    })

    const wlChartEl = document.getElementById('wlChart')
    const wlChart = new Chart(wlChartEl, {
        type: 'line',
        data: {
            labels: [ getTime(0), getTime(1), getTime(2), getTime(3), getTime(4) ],
            datasets: [
                {
                    label: 'Tingkat Air',
                    data: [0.3, 0.3, 0.6, 0.4, 0.2],
                    borderColor: 'rgba(50, 115, 220, 0.5)'
                }
            ]
        },
        options: {
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: true,
                    ticks: {
                        suggestedMin: 0.0,
                        beginAtZero: true,
                        suggestedMax: 1.0
                    }
                }
            }
        }
    })

    // Websocket
    socket = new WebSocket(url)
    socket.addEventListener('open', () => {
        console.log('Connection opened')
    })
    socket.addEventListener('close', () => {
        console.log('Connection closed')
    })
    socket.addEventListener('message', event => {
        const eventData = JSON.parse(JSON.parse(event.data))
        console.log(`Received data: ${JSON.parse(event.data)}`)

        if (eventData.hasOwnProperty('ph')) {
            updateData(phChart, eventData['ph'])
        } else if (eventData.hasOwnProperty('air')) {
            updateData(wlChart, eventData['air'] / 1000)
        }
    })

    // Dummy data
    const tambahData = (type, max, min) => {
        const data = type == 'ph'
        ? {
            'ph': getRandomData(max, min)
        }
        : {
            'air': getRandomData(max, min)
        }

        socket.send(JSON.stringify(data))
    }

    document.getElementById('addPhBtn').addEventListener('click', () => tambahData('ph', 14.0, 1.0))
    document.getElementById('addWlBtn').addEventListener('click', () => tambahData('air', 1000, 0))
})