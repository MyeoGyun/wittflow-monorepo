
import { SVGProps } from "react"

export function WittflowLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="256"
            height="256"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <style>{`
          .note-bg { fill: #2563EB; }
          .note-fold { fill: #93C5FD; }
          .text-style {
            fill: #FFFFFF;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: 900;
            font-size: 15px;
            letter-spacing: -0.5px;
            text-anchor: middle;
            dominant-baseline: middle;
          }
          .check-accent { 
            fill: none; 
            stroke: #93C5FD; 
            stroke-width: 3; 
            stroke-linecap: round; 
            stroke-linejoin: round; 
          }
        `}</style>
            </defs>

            <path className="note-bg" d="M 15,5 H 75 L 95,25 V 85 C 95,90.5 90.5,95 85,95 H 15 C 9.5,95 5,90.5 5,85 V 15 C 5,9.5 9.5,5 15,5 Z" />
            <path className="note-fold" d="M 75,5 V 25 H 95 Z" />

            <text x="50" y="50" className="text-style">WITTFLOW</text>
            <path className="check-accent" d="M 40 65 L 48 73 L 62 59" />
        </svg>
    )
}
