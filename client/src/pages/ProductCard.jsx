import { useState, useEffect } from "react"

export function ProductCard({ product }) {
    return (
        <div>
            <h1>Product Card</h1>
            <p>Name: {product.name}</p>
            <p>Category: {}</p>
            <p>Rack: {product.rack}</p>
            <p>Bin: {product.bin}</p>
        </div>
    )
}