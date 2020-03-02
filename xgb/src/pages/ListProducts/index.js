import React from 'react';

import data from '../../services/json.json'

/*Rotas*/
import { Link, withRouter } from "react-router-dom";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

/*Componentes*/
import { BuildField } from '../../components/BuildField/index'
import { ListClients } from '../../components/ListClients/index'

import "./style.css"

let clients = data.CLIENTS;
let budget = data.BUDGET;

class ListProducts extends React.Component {
	
	constructor(props){
    	super(props)
	    	this.state = {

	    	/*Nome do Produto*/
	        name: '',
	        price: '', 
	        id: '',

	        stateProduct: false,

	        /*Data*/
	        products: data.PRODUCTS,
	        budget: data.BUDGET

	      }
  	}

  	/*Atualizando o estado dos inputs*/
  	handleChange = (name, value) => this.setState({ [name]: value });

  	/*Busca o nome do produto inserido pelo usuário*/
	verifyProduct = (name, price) => this.state.products.map((product, i) => {
		if(name == product.name) {
			this.stateProduct = true
		}
	})
  	


 	/*Delete - CRUD - Products*/
 	onDeleteHandle() {
 		let id = arguments[0];

 		this.setState({
 			products: this.state.products.filter(item => {
 				if(item.id !== id ) {
 					return item
 				}
 			})
 		});
 	}

 	/*Update - CRUD - Products*/
 	renderEditForm() {

 		return(
 			<div className="form-edit-product">
 				<form onSubmit={this.onUpdateHandle.bind(this)}>
 					<h1 className="title-6">Edit this project</h1>

 					<h3>New Name of Product:</h3>
 					<input type="text" className="item-name"name="updateItemName" defaultValue={this.state.name}/>
 					
 					<h3>New Price of Product:</h3>
 					<input type="text" className="item-price"name="updateItemPrice" defaultValue={this.state.price}/>
 					<button className="update-add-item">It is great for me!</button>
 				</form>
 			</div>
 		);	
 	}

 	onEditHandle(event) {

 		this.setState({
 			id: arguments[0], 
 			name: arguments[1],
 			price: arguments[2]
 		});

 		
 	}

 	onUpdateHandle(event) {
 		event.preventDefault();

 		this.setState({
 			products: this.state.products.map(itemProduct => {
 				if (itemProduct.id === this.state.id) {
 					itemProduct['name'] = event.target.updateItemName.value;
 					itemProduct['price'] = event.target.updateItemPrice.value;

 					return itemProduct;
 				}
 				return itemProduct;
 			})

 			
 		})
 	}

 	editBudget(prodBuy, priceBuy, myClient) {

 		const { valueNow } = this.state
 		this.setState({
	 			budget: this.state.budget.map(itemBudget => {
	 				if (itemBudget.client == myClient) {

	 					itemBudget['productsClient'] = [...itemBudget['productsClient'], prodBuy]

	 					itemBudget['value'] = [...itemBudget['value'], priceBuy]
	 					
	 					return itemBudget;
	 				}
	 				return itemBudget;
	 			})
	 			
	 	})
 	}
	onBuyProducts() {

		let prodBuy = arguments[0]
		let priceBuy = arguments[1]


	 	this.editBudget(prodBuy, priceBuy)

	 	data.CLIENTS.map((itemJson, i) => {
			if(itemJson.token == true) {

				this.editBudget(prodBuy, priceBuy, itemJson.name)
			}
		})


	}

  	handleSubmitForm = event => { 
    	event.preventDefault();

    	const { name, price } = this.state;

    	if(!name || !price){
     		alert("Por favor, preencha os campos!")
    	}else {
    		this.verifyProduct(name, price)

    		if(!this.stateProduct){

    				/*Create - CRUD - Products*/
    				this.setState({
    					products: [...this.state.products, {id: Date.now(), price: price, name: name }]
    				});
      			
    		} else if (this.stateProduct){
    			alert("Este produto já existe")
    		}

		}
	}

	meuCarrinho(){
		return(<button><Link to="/profile">Meu carrinho</Link></button>);
	}



	render(){
    	return (
		    <>

		    	{
						data.CLIENTS.map((itemJson, i) => {
							if(itemJson.token == true) {

								return(<h1 className="hello-user">Hello, {itemJson.name}</h1>);
								
							}
						})


				}

				{this.meuCarrinho()}

		        <h1 className="title-3">Choice your products and click in <span>To Buy</span></h1>
		        <div className="form-class">
			       	<form  onSubmit={this.handleSubmitForm}>
			        	<h2 className="title-4">Post a new product!</h2>

				          <BuildField 
				            title={"Name:"} 
				            value={this.state.name} 
				            handleChange={this.handleChange}
				            name = "name"
				          />

				          <BuildField 
				            title={"Price: "} 
				            value={this.state.price} 
				            handleChange={this.handleChange}
				            name = "price"
				            placeholder={"$"}
				          />

			        <button type="submit" className="create-product">Create a new project!</button>
			        </form>
			    </div>

		        
		        
		       <div className="list-products">

		      	<h2 className="title-5">List of Products</h2>

		       	<td className="sub-title">Name</td>

		       	<td className="sub-title">Price</td>

                {

					this.state.products.map((product, i) => {
						return (
							<>

							<tr key={product.id}>
								
								<td>{product.name}</td>
								<td>{product.price}</td>
								<td><button className="delete-button" onClick={this.onDeleteHandle.bind(this, product.id)}>Delete</button></td>
								<td><button className="edit-button" onClick={this.onEditHandle.bind(this, product.id, product.name, product.price)}>Edit</button></td>
								<button className="buy-button" onClick={this.onBuyProducts.bind(this, product.name, product.price)}>Buy this</button>
							</tr>

							
							</>
						);
					})
				}
            </div>
            
            {this.renderEditForm()}


		    </>
   		);
	}
}

export default withRouter(ListProducts);
