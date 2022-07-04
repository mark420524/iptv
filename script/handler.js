const fs = require('fs');

function loadjson(filepath){
    return new Promise((resolve, reject) =>{
		fs.readFile(filepath, (err,data)=>{
    		if(err){
    			reject(err)
    		}else{
    			let json = JSON.parse(data.toString());
    			resolve(json)
    		}
    	})
    
    });

    
}


function main(){
	
	loadjson('data/channels.json').then(res=>{
		let cn_channels = {};
		for(let i=0;i<res.length;i++){
			let item=res[i];
			let country = item.country;
			let info = {
				name: item.name,
				logo: item.logo
			}
			if (country==='CN' || country==='cn') {
				cn_channels[item.id]=info;
			}
		}
		//console.log(cn_channels)
		let cn_stream = []
		let set_stream = []
		loadjson('data/streams.json').then(res=>{
			
			for (let i=0;i<res.length;i++) {
				let item = res[i];
				if (!item.channel) {
					continue;
				}
				
				if (item.channel.indexOf('.cn')>-1 && item.status=='online'
					&& set_stream.indexOf(item.channel) == -1 
					) {
					cn_stream[cn_stream.length]=item;
					set_stream[set_stream.length]=item.channel;
				}
			}	
			//对stream去重,保留一个channel
			//console.log(cn_stream)
			cn_stream.forEach((item,index)=>{
				let id = item.channel;
				let info = cn_channels[id]
				
				item.name = info.name;
				item.logo = info.logo;
				
			});	
			let newArr = JSON.stringify(cn_stream)//将数组转成json格式
			  
		   fs.writeFile('output/iptvstream.json', newArr, 'utf8', (err) => {
		     //console.log('写入功', err)
		   })
			
		})
		
		
	})
	
}
main()