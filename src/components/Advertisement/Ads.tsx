import { Newspaper } from 'lucide-react'
import React from 'react'

const Ads = () => {
  return (
          <div className="border-2 border-dashed border-border rounded-sm p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
        <Newspaper className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Advertisement Space</p>
        <p className="text-xs text-muted-foreground/60 mt-1">300 x 250</p>
      </div>
  )
}

export default Ads