export function applyVintageFilter(canvas, ctx) {
    
    const imageData = ctx.getImageData(
        0,
        0,
        canvas.width, canvas.height
    )

    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {

        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        data[i] = r * 1.1
        data[i + 1] = g * 1.05
        data[i + 2] = b * 0.9

    }

    ctx.putImageData(imageData, 0, 0)

}