<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.



 */
?>
<style>
    .tableWrapper{
        width:100% !important;
    }
</style>


<script type="text/template" id="prod_tmpl">
<tr id="<%= id %>" class="even">
<td><%= product_name %></td>
<td><%= stock_available %></td>
<td><%= quantity_crate %></td>
<td>0</td>
<td>0</td>
<td><%= min_stock_notif %></td>
<td><%= max_stock_notif %></td>
<td><%= category_product %></td>
<td><%= cost_price  %></td>
<td><%= selling_price  %></td>
<td>
<ul class="rowActions">
<li><a href="#" class="inlineIcon preferences edit_prod">Edit</a></li>
<li><a href="#" class="inlineIcon preferences iconlock">Archive</a></li>
</ul>
</td>
<td></td>
<td></td> 
<td></td>
</tr>
</script>









<div class='tableWrapper'>
    <div class='tableHeader'>
        <ul class='tableActions'>
            <li>
                <a name="add_prod" type="prod" id="add_prod" title="Add New Product"  href="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_product')); ?>" class='inlineIcon iconWebsiteAdd'>New Product</a>
            </li>

            <li>
                <a name="add_sales" type="add_sales" id="add_sales" title="New Sales"  href="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_sales')); ?>" class='inlineIcon iconWebsiteAdd tran_type'>New Sales</a>
            </li>
            <!--
            <li>
                <a name="add_order" type="order" id="add_order" title="New Order"  href="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_sales')); ?>" class='inlineIcon iconWebsiteAdd tran_type'>New Order</a>
            </li>
            -->
            <li>
                <a name="add_recv" type="add_recv"  id="add_recv" title="New Receivables"  href="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_sales')); ?>" class='inlineIcon iconWebsiteAdd tran_type'>New Receivables</a>
            </li>

            <li>
                <a name="add_inv" type="add_inv" id="add_inv" title="New Invoice"  href="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_sales')); ?>" class='inlineIcon iconWebsiteAdd tran_type'>New Invoices</a>
            </li>

            <li>
                <a name="add_revr" type="add_revr" id="add_sales" title="Reversals"  href="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_sales')); ?>" class='inlineIcon iconWebsiteAdd tran_type'>Reversals</a>
            </li>
            <!--
              <li>
                  <a name="add_recpt" type="add_recpt"  id="add_recpt" title="Receipt Management"  href="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_recpt')); ?>" class='inlineIcon iconWebsiteAdd'>Receipts</a>
              </li>
            -->
            <li>
                <select id="enable_archive_status" name="enable_archive_status">
                    <option value="">Select Archive Status</option>
                    <option value="1">Show Archived Items</option>
                    <option value="0">Hide Archived Items</option>
                </select>
            </li>

            <li>
                <input type="text" name="search_prod" id="search_prod" placeholder="Search By Name"/>
            </li>
            <li>
                <input type="button" name="search_butt" id="search_butt" value="Search"/>
            </li>

        </ul>



        <div class='clear'></div>
        <div class='corner left'></div>
        <div class='corner right'></div>
    </div>


<table cellspacing='0' summary='' name="table_info" id="table_info">
    <thead>
        <tr>

            <th class="sortup">
               Name
            </th>
            <th class="sortup">
              Stock
            </th>
 <th class="sortup">
              Quant/Batch
            </th>
 <th class="sortup">
              Batch/Avl
            </th>
 <th class="sortup">
             Rmd
            </th>
 <th class="sortup">
             Stock Notification
            </th>
 <th class="sortup">
             Max Stock
            </th>
            <th> Category </th>

            <th > Cost Pr</th>
            <th  >
Selling Pr
            </th>
            <th class='last alignRight'>

            </th><th></th><th></th><th></th>
        </tr>
    </thead>




    <tbody name="table_info_tbody" id="table_info_tbody">
    
      </tbody>
</table>






    <div name="dialog-message" id="dialog-message" title="Message">
        <p class="messsage">
        </p>
    </div>
    <div name="dialog-confirm" id="dialog-confirm" title="Confirmation">
        <p class="messsage">
        </p>
    </div>
    <input type="hidden" name="product_list_url" id="product_list_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'product_list')); ?>" />
    <input type="hidden" name="product_add_url" id="product_add_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'add_product')); ?>" />
    <input type="hidden" name="product_del_url" id="product_del_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'del_product')); ?>" />
    <input type="hidden" name="stock_edit_url" id="stock_edit_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'edit_stock')); ?>" />
    <input type="hidden" name="stock_edit_url" id="stock_edit_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'edit_stock')); ?>" />
    <input type="hidden" name="product_batch_add_url" id="product_batch_add_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'batch_transaction')); ?>" />
    <input type="hidden" name="product_archive_url" id="product_archive_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'archive_product')); ?>" />
    <input type="hidden" name="transaction_print_list_url" id="transaction_print_list_url" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'get_print_info_list')); ?>" />
    <input type="hidden" name="product_list_back" id="product_list_back" value="<?php echo $this->Html->url(array('controller' => 'Customer', 'action' => 'products')); ?>" />

</div>

<?php
		
			//templates
          //echo $this->element('backbone_temp/product_list_template');
          echo $this->Html->script('backbone/backbone_stuff.js');
		//echo $this->Html->script('view_product_back.js'); ?>

