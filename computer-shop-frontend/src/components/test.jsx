import { useState } from "react"

export default function Test(){
	
	const [number , setNumber] = useState(11)

	return(
		<div className="w-full h-full flex justify-center items-center">
			<div className="w-[100px] h-[100px] lg:h-[200px] bg-red-900 lg:bg-green-900">

			</div>
		</div>	
	)
}