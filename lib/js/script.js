const app = {
	init() {
		Element.prototype.qs = Element.prototype.querySelector
		Element.prototype.qsa = Element.prototype.querySelectorAll
		window.dqs = e => document.querySelector(e)
		window.dqsa = e => document.querySelectorAll(e)
		app.loadVars()
		app.loadLinks()
	},
	loadVars() {
		dqsa('.var').forEach(varElement => {
			varElement.classList.remove('var')
			varElement.innerText = app.data[varElement.innerText]
		})
	},
	loadLinks() {
		let routes = app.data.routes

		Object.keys(routes).forEach(r => {
			let linkBlock = document.createElement('div')
			linkBlock.classList.add('linkBlock')

			let linkBlockName = document.createElement('span')
			linkBlockName.innerText = r

			linkBlock.appendChild(linkBlockName)

			routes[r].forEach(endpoint => {
				let link = document.createElement('a')
				link.innerText = endpoint.name
				link.onclick = e => {
					app.loadDoc(r, endpoint.name)
				}
				linkBlock.appendChild(link)
			})
			dqs('aside').appendChild(linkBlock)
		})
	},
	loadDoc(b, e) {
		console.log(b)
		let main = dqs('main>div')
		main.innerHTML = ''
		let block = app.data.routes[b]
		let endpoint = block.find(o => o.name === e)
		let docElement = document.createElement('div')
		docElement.insertAdjacentHTML('beforeend', `<h1>${endpoint.name}</h1>`)
		docElement.insertAdjacentHTML(
			'beforeend',
			`<p>${endpoint.description}</p>`
		)
		docElement.insertAdjacentHTML(
			'beforeend',
			`<div class="endpoint">
                <div class="method">${endpoint.method}</div>
                <div class="path">${app.data.root}${endpoint.path}</div>
                </div>`
		)
		if (endpoint.request.headers)
			docElement.insertAdjacentHTML(
				'beforeend',
				`
        <h2>Request Headers</h2>
        <p>${endpoint.request.headers[0]}</span>
        <div class="code">${JSON.stringify(
			endpoint.request.headers[1],
			null,
			4
		)}</div>`
			)
		if (endpoint.request.query)
			docElement.insertAdjacentHTML(
				'beforeend',
				`
        <h2>Request Query</h2>
        <p>${endpoint.request.query[0]}</span>
        <div class="code">${JSON.stringify(
			endpoint.request.query[1],
			null,
			4
		)}</div>`
			)
		if (endpoint.request.body)
			docElement.insertAdjacentHTML(
				'beforeend',
				`
        <h2>Request Body</h2>
        <p>${endpoint.request.body[0]}</span>
        <div class="code">${JSON.stringify(
			endpoint.request.body[1],
			null,
			4
		)}</div>`
			)
		docElement.insertAdjacentHTML('beforeend', `<h2>Response</h2>`)
		Object.keys(endpoint.response).forEach(res => {
			docElement.insertAdjacentHTML(
				'beforeend',
				`
                <h3 class="${endpoint.response[res].type}">${res}</h3>
                <p class="${endpoint.response[res].type}">${
					endpoint.response[res].description
				}</p>
        <div class="code space">${JSON.stringify(
			endpoint.response[res].data,
			null,
			4
		)}<div class="footer ${endpoint.response[res].tip ? '' : 'hide'} ${
					endpoint.response[res].type
				}">${endpoint.response[res].tip}</div></div>
        `
			)
		})

		main.appendChild(docElement)
	},
}

document.addEventListener('DOMContentLoaded', e => {
	fetch('/api.json')
		.then(res => res.json())
		.then(data => {
			app.data = data
			app.init()
		})
})
