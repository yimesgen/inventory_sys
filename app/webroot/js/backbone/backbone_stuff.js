
/***
 * 
 * 
 * 
 **/



var backbone_stuff={
	
	 list_url:$("#product_list_back").val(),
	 archive_status:$("#search_prod").val(),
	 search_value:$("#search_prod").val(),
	 prod_diag:$("#product-diag"),
	 trans_diag:$("#product_trans"),
	//this is the initialization for the backbone object
	 init:function(){
	
	 _this=this;
	 _this.configure_prod_diag();
	 _this.configure_tran_diag();
	 _this.backbone_product_mod_init();
	
	 }, 
	 default_ajax:{wait:true,
	 beforeSend(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Retrieving Details..."); 
	 },
     error:function(collection,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	 },
     success:function(collections,response,options){
		  settings.close_message_diag();
          settings.enable_okbutt_mgdialg();
		}
		},
	 
	 //
	 init_chosen:function(){
			
        
        $("#search_item").chosen();
        $("#reverse_reason").chosen();
        $("#supplier").chosen();
        $("#reverse_reason_chzn").hide();
        $("#supplier_chzn").hide() ;  
	 },
	 
	 //for rounding values
	  round_value:function(num){
        //   return num;
        return  Math.round(num * 100) / 100
    },
	 
	 
	 //callback will have to be created which will be used for setting up the cancel and save functionality 
	 dialog_save_action:function(){
		
		 
		},
		
	dialog_tran_action:function(){
		
		},	
	 
	 configure_tran_diag : function(){
		 _this=this ;
		
		var diag = $(_this.trans_diag);
        diag.dialog({
			 autoOpen: false,
             title:"Perform Transaction",
             width: 700,
             height: 420,
             closeOnEscape: false,
			 modal: true,
			 buttons: {
                    "Cancel": function() {
                        $( this ).dialog( "close" );

                    },
                    "Save": function() {
	    			
	    		backbone_stuff.dialog_tran_action();	
	    				
                    }
               
                }});
        diag.dialog('close'); 
		 
	 },
	 
	 configure_prod_diag:function(){
		 _this=this ;
		
		var diag = $(_this.prod_diag);
        diag.dialog({
			 autoOpen: false,
              title:"Add/Edit Product",
              width: 500,
              height: 300,
              closeOnEscape: false,
			modal: true,
			 buttons: {
                    "Cancel": function() {
                        $( this ).dialog( "close" );

                    },
                    "Save": function() {
	    			
	    		backbone_stuff.dialog_save_action();	
	    				
                    }
               
                }});
        diag.dialog('close');
                
	 },	
			
	 backbone_product_mod_init:function(){
		
	 _this_back=this;	
	 
	 
	 //for settting up pagination model to pass around paging data
	 var PageModel = Backbone.Model.extend({
	 defaults: {
     query :null,
	 pagination: null,
	 url:_this.list_url
     }
     });
	 
	 //for setting up the basic product model stuff	
	 var ProductModel = Backbone.Model.extend({
	 defaults: {
     id:null,
	 product_name: null,
	 user_id:null,
	 cost_price:null,
	 selling_price:null,
	 min_stock_notif:null,
	 max_stock_notif:null,
	 stock_available:0,
	 archive_status:0,
	 cost:0,
	 quant_sale:0,
	 new_stock:0
     },
     categories:[],
      //for  getting unit_price
     getUnitPrice:function(){
        return backbone_stuff.round_value(this.get("selling_price"));
    },
    //for getting old stock available
    getStockAvail:function(){
        return this.get("stock_available");
    },
    //for getting new cost of transaction for that particular item for the transaction
    getCost:function(){
        //  return this.unit_price*this.quant_sale;
        return backbone_stuff.round_value(this.get("cost"));
    },
    
    //this is  for gettng the new stock available for that particular item for the transaction
    getNewStock:function(){
        //  return this.stock_avail-this.quant_sale;
        return this.get("new_stock");  
    },
    ///this is for getting the quantity of the item which will be sold
    getQuant:function(){
        return this.get("quant_sale");
    },
    
    //this is for setting the quantity for a sale transaction
    setQuantSale(quant_sale){
		
	  if(quant_sale < 1 || quant_sale > this.get("stock_available")){
	
            //alert("Please Enter Correct Quantity."+"Quantity Should Be More Than 0 And Less Than Or Equal To Quantity Available");
            return "false";
        }
    else{
   
	transact_obj.meta("total_quantity_items",transact_obj.calculate_quan()-this.get("quant_sale"));
	transact_obj.meta("total_transaction",transact_obj.calculate_money()-this.get("cost"));
			
    this.set("quant_sale",parseInt(quant_sale,10));     
    this.set("cost",this.get("selling_price")*this.get("quant_sale"));
    this.set("new_stock",this.get("stock_available")-this.get("quant_sale"));
            
    transact_obj.meta("total_transaction",backbone_stuff.round_value(transact_obj.meta("total_transaction")+(this.get("cost"))));              
    transact_obj.meta("total_quantity_items",transact_obj.meta("total_quantity_items")+(this.get("quant_sale")));
            
    transact_obj.meta("vat_transaction",backbone_stuff.round_value((transact_obj.meta("vat_percentage")/100)*transact_obj.meta("total_transaction")));
    transact_obj.meta("rtotal_transaction",backbone_stuff.round_value(transact_obj.meta("total_transaction")+transact_obj.meta("vat_transaction")));
    transact_obj.meta("amount_balance_due",backbone_stuff.round_value(transact_obj.meta("rtotal_transaction")-transact_obj.meta("amount_paid")));
     
     return "true";        		
		  
		  }	
	
	}
    
    
    });
	   
	//for setting up the categories model which will be used  to load up category information which can be used 
   // for setting up a edit/empty model for stuff to be done 
	 var CatModel = Backbone.Model.extend({
	  defaults:{ 
	    id:null,	
	    long_name:null
		}	
		});
	 
	
	 //for basic collection extends  object with meta facilities
	 var MetaCollection = Backbone.Collection.extend({
     parse: function(data) {
	 },
     meta: function(prop, value) {
        if (value === undefined) {
            return this._meta[prop]
        } else {
            this._meta[prop] = value;
        }
     }
	 });
	   	
	   	
	  //for categories collection object
	 var CatCollection = Backbone.Collection.extend({
	  url:$("#product_cat").val(),
     model: CatModel,
     initialize: function() {
		 
	 },
      parse: function(data) {
	 //this.meta('pagination',(data.pagination) ? data.pagination : {});
    
     return data.cat_list;
     }	 });
	  
	   	
	 //for collection object for product	
	 var ProductsCollection = MetaCollection.extend({
	 _meta:[],
     url: _this_back.list_url,
     model: ProductModel,
     initialize: function() {
		 
	 },
     parse: function(data) {
	 var val = $("#search_prod").val();
     var archive_status=$("#enable_archive_status").val();
     var query_string=val!="" ? "filter="+val+"&arch_stat="+archive_status : "filter=null"+"&arch_stat="+archive_status;		 
	 this.meta('pagination',(data.pagination) ? data.pagination : {});
	 this.meta('cpage',(data.pagination) ? this.url+"?page="+data.pagination.page+"&"+query_string : {});
	 this.meta('suppliers',(data.suppliers) ? data.suppliers : {});
	 this.meta('reverse',(data.reverse) ? data.reverse : {});
	 this.meta('products',(data.products) ? data.products : {});
	 this.meta('vat',(data.vat) ? data.vat : {});
     return data.products;
     },
    
     //this is for calculating total quantity of current transaction
    ///tricky stuff
     calculate_quan:function(){
     
     var sum =0;      
     this.each(function(model_data) {
     sum=sum+model_data.get('quant_sale');
     });
     return sum;
     },
     
     ///this is for calculating the total money value for the transaction
     calculate_money:function(){
     var cost =0;      
     this.each(function(model_data) {
     cost=cost+model_data.get('cost');
     });
     return cost;
     },
         //this is for removing an item from a transaction 
       //and also for recalculating items  every stuff when items are removed
     removeItem:function(item){
		
	 this.each(function(model_data) {
	 if(model_data.get("id")==item.get("id")){
	 this.meta("total_transaction",backbone_stuff.round_value(this.meta("total_transaction")-item.get("cost")));	
     this.meta("total_quantity_items",this.meta("total_quantity_items")-parseInt(item.get("quant_sale"),10));
      
       //this is for recalculating the other stuff
     this.meta("vat_transaction",backbone_stuff.round_value((this.meta("vat_percentage")/100)*this.meta("total_transaction")));
     this.meta("rtotal_transaction",backbone_stuff.round_value(this.meta("total_transaction")+this.meta("vat_transaction")));
     this.meta("amount_balance_due",backbone_stuff.round_value(this.meta("rtotal_transaction")-this.meta("amount_paid")));
     this.recal_totl();
     
		}});
	 },
	 
	 //for recalculating total
	 recal_totl:function(){
    
        if( this.meta("tran_type_send")=="add_sales"){
            this.meta("amount_paid")=backbone_stuff.round_value(amount_paid);
            this.meta("amount_balance_due")=backbone_stuff.round_value(this.meta("rtotal_transaction")-this.meta("amount_paid"));
        }

     }
		
       
	 });		
	
	
	
	//models for the 4 subfields (subtotal,vat,total,amount_paid)
	
	
	 var Stotal = Backbone.Model.extend({
	  defaults:{ 
	    total_trans_for_sale:0,	
	    total_cost_for_sale:0.00
		}	
		});
	
	
	
	
	
	
	
	 //view for product_add item
	//accepts a product model as an input model
	
	 var ProductView= Backbone.View.extend({
	 tagname:'div',
	 id:'product_div',
	 model:ProductModel,
	 cat_list:[],
	 template: _.template($('#product_tmpl').html()),
	 
	 initialize:function(){
	 _this_prod_view=this;
	 backbone_stuff.dialog_save_action=function(){
	_this_prod_view.SaveProduct();
	 }; 
	 },
	 events: {

	 },
	 render:function(){	 
	 var pass_data={
	 product:this.model.toJSON(),
	 cat_data:this.model.get('cat_list')
	 };
	 	 
     var html = this.template(pass_data);
     this.$el.html(html);
     return this;
	 },
	 
	 //this is used for performing validation before the model is saved
	 //this is for saving a product and adding it to the collection object
     SaveProduct:function(event){
	 _this_prod_view=this;
	  counter=0;	 
	  $(".check").each(function(){
      
            if(!(document.getElementById($(this).attr("id")).checkValidity()) ){
            $(this).css("border","solid #F44 2px"); 
            _this_prod_view.model.set($(this).attr("name"),'');
            counter++;
            }else
            {
            $(this).css("border","solid grey 1px");  
            _this_prod_view.model.set($(this).attr("name"),$(this).val());    
                     
			}
      })	;
      
      if(counter==0)
      {
	 product_list.create(_this_prod_view.model.toJSON(),
		{wait:true,
	 beforeSend(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Saving Data..."); 
	 },
     error:function(collection,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	 },
     success:function(collections,response,options){
	 settings.close_message_diag();
     settings.enable_okbutt_mgdialg();
     $(backbone_stuff.prod_diag).dialog('close'); 
     product_list.fetch(
     /**{wait:true,
	 url:product_list.meta('cpage'),
	 beforeSend(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Retrieving Details..."); 
	 },
     error:function(collection,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	 
	 },
     success:function(collections,response,options){
		  settings.close_message_diag();
          settings.enable_okbutt_mgdialg();
	 }
	 }**/);	 
     
     
          //this.meta('cpage');       
	 }});  		  
	 }  
	 } 
	 });
	
	//view for pagination item
    
     var PaginateView= Backbone.View.extend({
	 tagname:'div',
	 id:'page_div',
	 model:PageModel,
	 template: _.template($('#paginate_tmpl').html()),
	 
	 render:function(){	 
		 	 
	 var pass_data={
	 query:this.model.get('query'),
	 url:this.model.get('url'),
	 paginate:this.model.get('pagination')
	 };
	 //console.log(pass_data);
     var html = this.template(pass_data);
     this.$el.html(html);
     return this;
	 }
	 });
	
	
	
	  //view for subtotal_temp
	   var subTotalView= Backbone.View.extend({
	 tagName: 'tr',
     className :"total_trans_tr",
     template: _.template($('#subtotal_tmpl').html()),
	 render:function(){	 
		 	 
	 var pass_data={
	
	 };
	 //console.log(pass_data);
     var html = this.template(pass_data);
     this.$el.html(html);
     return this;
	 }
	 });
	  
	  //view for vat
	 var vatView= Backbone.View.extend({
	 tagName: 'tr',
     className :"total_vat_tr",
     template: _.template($('#vat_tmpl').html()),
	 render:function(){	 
		 	 
	 var pass_data={
	
	 };
	 //console.log(pass_data);
     var html = this.template(pass_data);
     this.$el.html(html);
     return this;
	 }
	 });
	  
	  //view for total_temp
	 var rtotalView= Backbone.View.extend({
	 tagName: 'tr',
     className :"total_rtotal_tr",
     template: _.template($('#total_tmpl').html()),
	 render:function(){	 
		 	 
	 var pass_data={
	
	 };
	 //console.log(pass_data);
     var html = this.template(pass_data);
     this.$el.html(html);
     return this;
	 }
	 });
	  
	  
	 //view for amount
     var amtView= Backbone.View.extend({
	 tagName: 'tr',
     className :"rtotal_amt_tr",
     template: _.template($('#amt_tmpl').html()),
	 render:function(){	 
		 	 
	 var pass_data={
	
	 };
	 //console.log(pass_data);
     var html = this.template(pass_data);
     this.$el.html(html);
     return this;
	 }
	 }); 
	
	
	//view for  whole transaction list 
	
	 var TranListView = Backbone.View.extend({
	 tagname:'div',
	 collection:ProductsCollection,
	 template:_.template($('#transaction_template').html()),
	 /**will find out later why this did not work
	  * list_prod_table:$("#sales_info_trans table tbody"),**/
	 events:{
	 "change #search_item" : "addItem", 
	 },
	 addItem(event){
	
	 event.preventDefault();
	 var stock      = parseInt($('option:selected', $(event.currentTarget)).data('stock'));
     var unit_price = parseFloat($('option:selected', $(event.currentTarget)).data('unit_price'));
     var name =$('option:selected', $(event.currentTarget)).data('name');
     var itemId =$('option:selected', $(event.currentTarget)).val();
     var item_add=new ProductModel({id:itemId,product_name:name,stock_available:stock,selling_price:unit_price});	   
     
     //validation of transction object happens here
     var validate_check=this.validate_trans(this.collection.meta("tran_type_send"),item_add);
      
	 if(validate_check.status=="true")
	 {
	 this.addModel(item_add);
	 if(this.collection.meta("total_interface_status")=="false")
	 {
		 this.add_sub_interface(this.collection.meta("tran_type_send"));
		 this.collection.meta("total_interface_status","true");
	 }
	 
	 }
	 else if(validate_check.status=="false"){
	 settings.enable_okbutt_mgdialg();
     settings.show_message(validate_check.message); 
	 }
	 
	 //check will be done here to see if this is the first item being added after which the subtotal etc will be added
	 
	 },
	
	//this is used for editing the subinterfaces
	 edit_sub_interface(tran_type){
		 
	switch(tran_type){
	
	case "add_sales":
	//add_sales_view will be changed to match the current value of the meta data
	
	break;	
		
	}	 
		 
	},
	 
	 //this will be used for adding the sub interface
	 add_sub_interface(tran_type)
	 {
		 	 
		 switch(tran_type) {
			 
            case "add_sales":
            var sut_sub = new subTotalView();
            var vat_sub = new vatView();
            var rtv_sub = new rtotalView();
            var amt_sub = new amtView();                  
	        $("#sales_info_trans table tbody")
	        .append(sut_sub.render().$el)
	        .append(vat_sub.render().$el)
	        .append(rtv_sub.render().$el)
	        .append(amt_sub.render().$el);
            break;
		    
		    case "add_recv":
		    var sut_sub = new subTotalView();
		    $("#sales_info_trans table tbody").append(sut_sub.render().$el)
            break;
            
            case "add_inv":
            var sut_sub = new subTotalView();
            var vat_sub = new vatView();
            var rtv_sub = new rtotalView();
            $("#sales_info_trans table tbody")
	        .append(sut_sub.render().$el)
	        .append(vat_sub.render().$el)
	        .append(rtv_sub.render().$el); 
            break;
            
            case "add_revr":
            var sut_sub = new subTotalView();
		    $("#sales_info_trans table tbody").append(sut_sub.render().$el)
            break;
            
        }		 
	 },
	 
	 validate_trans(tran_type,item){
		 
	 var status="true";
	  //condition for sales
     if(tran_type=="add_sales"){	  
	  if(item.get("stock_available")<=0)
	 {return {status:"false",message:"Stock Of "+item.get("product_name")+" Is "+item.get("stock_available")+"<br>Please Restock"}}       
      
      else if( item.get("stock_available")!==item.get("stock_available")  || item.get("selling_price")!==item.get("selling_price"))
     { return {status:"false",message:"Error with Stock"}}
     
	 }
    
     //condition for receivables/invoice/reversal
     else if(tran_type=="add_recv" || tran_type=="add_inv" || tran_type=="add_revr"){
    
      if( item.get("stock_available")!==item.get("stock_available")  || item.get("selling_price")!==item.get("selling_price"))
     { return {status:"false",message:"Error with Stock"}}
    
    
     }
     
	 //generic stuff to make sure duplicates are not in final transaction object after other checks
     this.collection.each(function(model_data) {
	 if(model_data.get("id")==item.get("id")){
      status="false"
     return { status:"false",message:"Item Aready Exists In List<br>Please Edit Below"} 
	 }});
	 
	  if(status=="true")
	 {return {status:"true",message:"validation succcesfull"}}
	 else if (status=="false")
	 {return {status:"false",message:"Item Aready Exists In List<br>Please Edit Below"}}
	 
	 }, 
	 
	 addModel(item_add){
	 this.collection.add(item_add);
	 var prodlist = new ProductTranItemView({model:item_add});
	 $("#sales_info_trans table tbody").prepend(prodlist.render().$el);
	 },	
	  
	 render:function(){
	 var pass_data = {
		suppliers:this.collection.meta('suppliers'),
		reverse:this.collection.meta('reverse'), 
		products:this.collection.meta('products'),
		vat:this.collection.meta('vat')
		};
	 var html = this.template(pass_data);
     this.$el.html(html);
     return this; 	 
	 }		
	 });
	
	//view for a single product list item which can be added to transaction
	 var  ProductTranItemView=Backbone.View.extend({
	 tagName: 'tr',
     id:function(){return this.model.get( 'id')},
     template: _.template($('#transaction_item_tmp').html()),	
     events:{
	 "keyup .item_for_sale":"editItem"	 
	 },
	 render: function() {
     var html = this.template(this.model.toJSON());
     this.$el.html(html);
     return this;
	 },
	 editItem(event){
		
	 //perform validation before doing other stuff
	 if (!(event.currentTarget.validity.valid)){
         settings.enable_okbutt_mgdialg();
         settings.show_message("Please Enter Correct Value");
         $(event.currentTarget).val(this.model.getQuant());		 
     }
     else{		
	 var return_info = this.model.setQuantSale($(event.currentTarget).val());	
     if(return_info=="false"){  
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Stock iS Less Than Amount Needed.<br>Please Restock")				
     $(event.currentTarget).val(this.model.getQuant());		 

     }else if(return_info=="true"){
      this.render();					
	 
	 }  
 
	 }
     
     },
     
     //for sales transasctions
     perform_sales_trans:function(){
		
		
	 },
	 
	 //for receivables transactions
	 perform_rec_trans:function(){
		 
	 },
	 
	 //for invoicing transactions
	 perform_inv_trans:function(){
		 
	 },
	 
	 //for reversal transaction
	 
     
     
     
	 });
	
	
	//view for a single product_list_item
	 var ProductsItemView = Backbone.View.extend({
     tagName: 'tr',
     id:function(){return this.model.get( 'id')},
     className :function(){ return this.model.get( 'class_name')},
     template: _.template($('#prod_tmpl').html()),
     
     initialize: function() {
	 
	 this.listenTo(this.model, 'sync', this.render);

	 },
	 events: {
     'click .iconlock':  'onArch',
     'click .iconopen':  'onArch',
     'click .edit_prod': 'onEdit'

	 },
	 
	 onArch:function(event){
	 _this_addprod=this;
	 event.preventDefault();	 
	 console.log(_this_addprod.model.toJSON());
	 console.log("arch_stat--"+_this_addprod.model.get("archive_status"));
	  
	 settings.confirmation_action=function(){
	 _this_addprod.model.destroy({wait:true,
	 beforeSend(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Saving Data..."); 
	 },
     error:function(model,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	  settings.confirmation_action=function(){};
	 },
     success:function(model,response,options){
	 settings.close_message_diag();
     settings.enable_okbutt_mgdialg();
     settings.confirmation_action=function(){};
     product_list.fetch();  
		}
		});
	 };
	 settings.show_confirmation("Do You Want to Archive/Unarchive ");
	
	 },

	 render: function() {
		 
     var html = this.template(this.model.toJSON());
     this.$el.html(html);
     return this;
	 },
	 
	 onEdit:   function(event){
	 _this=this;
	 event.preventDefault();
	 console.log(_this.model.toJSON());
	 var $product = $('#product-diag').empty();
	 
	 _this.model.fetch({wait:true,
	 beforeSend(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Retrieving Details..."); 
	 },
     error:function(model_data,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	 },
     success:function(model_data,response,options){
		 console.log(response);
		  settings.close_message_diag();
          settings.enable_okbutt_mgdialg();
          var product = new ProductView({model:model_data});
          $product.append(product.render().$el);
          $(backbone_stuff.prod_diag).dialog('open');
                   
		}
		}); 
		
	 },
	 
	 onRemove: function(event) {
		 
     this.model.destroy(
     /**error:function(model,response,options){
	 console.log("model could not be destroyed successfully");
	 },
     success:function(model,response,options){
	 console.log("model destroyed successfully");
	 }**/
	 );  
     }
	 });
	
	
	 // View class for rendering the list of all products
     ////this is for the whole collection of the productlist
	
     var ProductListView = Backbone.View.extend({
	 el: '.tableWrapper',


	 list_view_table:$('#table_info_tbody'),
	 list_paginate_view:$('#page_outer_div'),
	 list_template_trans:$("#product_trans"),
	 

     initialize: function() {
	 _this_list=this;
     
     this.listenTo(this.collection, 'sync', this.render);
     //this.listenTo(this.collection, 'add', this.addOne);
     this.listenTo(this.collection, 'request', this.request_event);
     this.listenTo(this.collection, 'error', this.error_event);
     
     //this.listenTo(this.collection, 'add', this.addOne);
    
     
	 },
	 
	 request_event:function(){
	 
	 console.log("request_event fired");	 
     },
     
     error_event:function(){
	 
	 console.log("error event fired");	 
     },
	 
	 render: function(event) {
	 
	 console.log("sync event fired");
	  console.log("meta--data--");
	 console.log(_this_list.collection.meta('pagination'));
	 
	 _this_list=this;	
     var $list = this.$('#table_info_tbody').empty();
     var $page = this.$('#page_outer_div').empty();
     var i = 2 ; 
     this.collection.each(function(model_data) {
     model_data.set('class_name',(i%2==0) ? "even" :"odd");
     var item = new ProductsItemView({model: model_data});
     $list.append(item.render().$el);
     i++;
     }, this);
	
	 var val = $("#search_prod").val();
     var archive_status=$("#enable_archive_status").val();
     var query_string=val!="" ? "filter="+val+"&arch_stat="+archive_status : "filter=null"+"&arch_stat="+archive_status;
	 var page = new PaginateView({model:new PageModel({
	 query:query_string,
	 pagination:_this_list.collection.meta('pagination')})});
	 $page.append(page.render().$el);
     return this;
    
     },
    
     events: {
     'click #add_prod'     : 'onCreateDiag',
     'click .tran_type'    :  'setupTransaction',
     'keyup #search_prod'  : 'searchKey',
     'click #search_butt'  : 'otherSearch',
     'click span.pglink a' : 'onPage',
     'click .tran_type'    : 'openTran'

     },
     
     
     /*
     * this is for the transaction object
     **a flag is passed through which will be used for setting the kind of transaction it is
     **this will influence the kind of info which will be shown in the tran page
      tran_type,taxes,product,supplier,reverse reason
     *tran_type/taxes will be a property of the collection/transaction object
     * 
     *product list will be passed into the transaction template and shown regardless of transaction type
     *supplier list will be passed into the transaction template(may show depending on transaction)
     *reverse reason list will be passed into the transaction template(may show depending on transaction)
     
     
     *subtotal is a property of the collection/transaction object(view will be created and added on first adds)
     *taxes/vat will be a property of the the collection/transaction object(view will be created and added on first adds)
	 *total  will be a property of the the collection/transaction object(view will be created and added on first adds)
	 *amount will be a property of the the collection/transaction object(view will be created and added on first adds)
	 
	 
	 *product item will be passed into transaction template when item is selected (dynamicall added through created view) 
		
     * 
     */
     openTran:function(event){
		 
	 var tran_type_send=event.currentTarget.type;	 
	 var title_diag = event.currentTarget.title;	
	 event.preventDefault();	 
	 transact_obj.fetch({wait:true,
	 url:$("#product_transact_url").val(),
	 beforeSend(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Retrieving Details..."); 
	 },
     error:function(collection,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	 
	 },
	 //get response
	//pass data into template and create transaction div
   // dynamically add item objects to div
     success:function(collection_data,response,options){
		 
	//   var transact_inst = new ProductsCollection(); 	 
	//   transact_inst.meta("suppliers",collection_data.meta("suppliers"));
   //	 transact_inst.meta("reverse",collection_data.meta("reverse"));
  //	 transact_inst.meta("products",collection_data.meta("products"));
  //	 transact_inst.meta("vat",collection_data.meta("vat"));
	 collection_data.reset();
	 collection_data.meta("tran_type_send",tran_type_send);
	 collection_data.meta("total_transaction",0);
	 collection_data.meta("total_quantity_items",0);
	 collection_data.meta("amount_paid",0.00);
	 collection_data.meta("amount_balance_due",0.00);
	 collection_data.meta("total_interface_status","false");
	 collection_data.meta("vat_transaction",0.00);
	 collection_data.meta("rtotal_transaction",0);
	 collection_data.meta("reverse_reason","");
	 collection_data.meta("supplier",0);


	 if(collection_data.meta("tran_type_send")=="add_sales" || collection_data.meta("tran_type_send")=="add_inv"){
               collection_data.meta("vat",collection_data.vat);
            // alert(transaction.vat_transaction);
     }
            else{
		  collection_data.meta("vat",0.00);
     }
         
	var $trans_list = this.$("#product_trans").empty();
	settings.close_message_diag();
	settings.enable_okbutt_mgdialg();
	var product = new TranListView({collection:transact_obj});
	$trans_list.append(product.render().$el);
	$(backbone_stuff.trans_diag).dialog({ title:title_diag});
	$(backbone_stuff.trans_diag).dialog('open');
	backbone_stuff.init_chosen();
	$(".ul_chz").css({"text-align":"center","margin-left":"120px !important","margin-bottom":"5px !important"});
	$(".chzn-container").css({"width":"340px !important"});        
                  
	if(collection_data.meta("tran_type_send")=="add_revr"){
	$("ul.sp_ul").remove() ;
	$("#reverse_reason_chzn").show() ;
    }
    else  if(collection_data.meta("tran_type_send")=="add_recv"){
    $("ul.rs_ul").remove() ;
    $("#supplier_chzn").show();  
    }
    else{
    $("ul.sp_ul").remove() ;
    $("ul.rs_ul").remove() ;
    }
    }
	})
	 
	 },
     
     addOne:function(model_data){
	 
	 console.log("add event fired");
	 model_data.set('class_name',"odd");
     var item = new ProductsItemView({model: model_data});
     this.list_view_table.append(item.render().$el);
	 return true ; 
	 },
     
     searchPage:function(url_send){
		  
	 
	 console.log(url_send);
	 //this.collection.url=url_send;
	 this.collection.fetch({wait:true,
	 url:url_send,
	 beforeSend(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Retrieving Details..."); 
	 },
     error:function(collection,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	 
	 },
     success:function(collections,response,options){
		  settings.close_message_diag();
          settings.enable_okbutt_mgdialg();
		}
		});	 
	 },
	 
	 searchKey:function(event){
	 event.preventDefault();
            if(event.which==13){
	 var val = $("#search_prod").val();
     var archive_status=$("#enable_archive_status").val();
     var query_string=val!="" ? "filter="+val+"&arch_stat="+archive_status : "filter=null"+"&arch_stat="+archive_status;	
   	 url_send=this.collection.url+"?"+query_string;			
				
	 this.searchPage(url_send);
	 }
	 },
	 
     onPage:function(event){
	 event.preventDefault();
	 //console.log(event.currentTarget);
     this.searchPage(event.currentTarget.href);
	 },
	 
	 otherSearch:function(event){
     event.preventDefault();
     
     var val = $("#search_prod").val();
     var archive_status=$("#enable_archive_status").val();
     var query_string=val!="" ? "filter="+val+"&arch_stat="+archive_status : "filter=null"+"&arch_stat="+archive_status;	
   	 url_send=this.collection.url+"?"+query_string;			
	 this.searchPage(url_send);
	 },
	 
     setupTransaction:function(evt){
		/**add_prod,add_sales,add_recv,add_inv,add_revr**/
		console.log(evt);
		
     },
    
    
     //supposed to load a new cateogry object and then use it as 
    //input for creating the add/edit product template
    onCreateDiag: function(event) {
		_this=this;
	event.preventDefault();
    var $product = $('#product-diag').empty();
	catData.fetch(
	{wait:true,
	 beforeSend:function(){
     settings.disable_okbutt_mgdialg() ;
     settings.show_message("Retrieving Details..."); 
	 },
     error:function(collection,response,options){
	 settings.enable_okbutt_mgdialg();
	 settings.show_message("Error<br>"+"Please Try Again");	
	 },
     success:function(collection,response,options){
		  settings.close_message_diag();
          settings.enable_okbutt_mgdialg();
          var product = new ProductView({model:new ProductModel({cat_list:response.cat_list})});
          $product.append(product.render().$el);
          $(backbone_stuff.prod_diag).dialog('open');
          
	}
	}
	);
   
	}
	});
	
	//for creating instance of collection object and view object
   // use reset instead of fetch for bootstraping
   // cat data is also created but not instantiated
	 var catData=new CatCollection();
	 var product_list = new ProductsCollection();
	 var transact_obj = new ProductsCollection();
	 var productView  = new ProductListView({collection: product_list});
	 product_list.fetch(backbone_stuff.default_ajax);
	 //product_list.reset(<%= @product_list.to_json %>);


 
}
}


$(document).ready(function(){

	backbone_stuff.init();

});