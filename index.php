<?php
session_start();
session_unset();

global $apikey, $apisecret, $base_url;

$apikey = '';
$apisecret = '';
$base_url = 'https://fapi.binance.com/';

if( !function_exists( 'get_api_curl_with_header' ) ){
	
	function get_api_curl_with_header( $parameter = NULL, $url = NULL ) {
		
		global $apikey, $apisecret;
		
		$signature = hash_hmac( 'SHA256', $parameter, $apisecret );
		$url .= $parameter.'&signature='.$signature;
		$ch = curl_init( $url );
		curl_setopt( $ch, CURLOPT_HTTPHEADER, array( 'X-MBX-APIKEY:'.$apikey ));
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1 );
		curl_setopt( $ch, CURLOPT_URL, $url );

		$result = curl_exec( $ch );
		return json_decode($result, true);
	}	
}
if( !function_exists( 'get_user_current_pnl' ) ){
	
	function get_user_current_pnl() {
		
		global $base_url;
		$timestamp = time()*1000;
		
		$parameter = 'timestamp='.$timestamp;
		$url = $base_url."fapi/v2/balance?";

		$current_pnl = get_api_curl_with_header( $parameter, $url );
		
		if( !empty( $current_pnl ) && is_array( $current_pnl ) ){
			return current( $current_pnl );
		}
	}	
}

if( !function_exists( 'get_order_position_risk' ) ){
	
	function get_order_position_risk() {
		
		$position_risk = array();
		global $base_url;
		$timestamp = time()*1000;
		
		$parameter = 'limit=4&timestamp='.$timestamp;
		$url = $base_url."fapi/v1/adlQuantile?";

		$open_orders = get_api_curl_with_header( $parameter, $url );

		if( !empty( $open_orders ) && is_array( $open_orders ) ){
			
			foreach( $open_orders as $k => $open_order ){
				
				if( isset( $open_order['symbol'] ) && !empty( $open_order['symbol'] ) ){
					
					$timestamp = time()*1000;
					$parameter = 'symbol='.$open_order['symbol'].'&timestamp='.$timestamp;
					
					$url = $base_url."fapi/v2/positionRisk?";
					$positionrisk = get_api_curl_with_header( $parameter, $url );
					
					if( !empty( $positionrisk ) && is_array( $positionrisk ) ){
						
						$position_risk[] = current( $positionrisk );
					}
				}
			}
		}
		return $position_risk;
	}	
}

if( !function_exists( 'get_order_symbol' ) ){
	
	function get_order_symbol(){
			
		global $base_url;
		$timestamp = time()*1000;
		$parameter = 'limit=4&timestamp='.$timestamp;
		$url = $base_url."fapi/v1/adlQuantile?";

		$open_orders = get_api_curl_with_header( $parameter, $url );
		$symbol = array(); $str = '';
		
		if( !empty( $open_orders ) && is_array( $open_orders ) ){
			
			foreach( $open_orders as $k => $orders){
				
				if( isset( $orders['symbol'] ) ){
				
					$symbol[] = $orders['symbol'];
					$str .= '<div id="chart_div'.( $k + 1 ).'" class="chart_div">
							<h2 class="chart_title"></h2>
						</div>';	
				}
			}
		}
		echo $str."<script> var all_symbol = '".json_encode( $symbol )."'</script>";
	}
}
if( !function_exists( 'get_opern_order_symbol' ) ){
	
	function get_opern_order_symbol(){
		
		global $base_url;
		$timestamp = time()*1000;
		$parameter = 'timestamp='.$timestamp;
		
		$url = $base_url."/fapi/v1/openOrders?";
		$openOrders = get_api_curl_with_header( $parameter, $url );
		
		$symbol = array();
		if( !empty( $openOrders ) && is_array( $openOrders ) ){
			
			foreach( $openOrders as $k => $orders){
				
				if( isset( $orders['symbol'] ) && isset( $orders['side'] ) && isset( $orders['price'] ) ){
					$symbol[] = array( 'symbol' => $orders['symbol'], 'side' => $orders['side'], 'price' => $orders['price'] );
				}
			}
		}
		echo "<script> var open_orders = '".json_encode( $symbol )."'</script>";
	}
}

?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Binance Trade | Chart </title>
		<link rel="stylesheet" href="assets/css/chart.css">
	</head>
	<script>var data_store  = '<?php echo json_encode( get_order_position_risk() ); ?>';</script>
	<body>
		<?php get_opern_order_symbol(); ?>
		<div class="kline_chart">
			<?php get_order_symbol(); ?>
		</div>
		<div class="open_trades">
			<table>
				<thead>
				  <tr>
					<th>Symbol</th>
					<th>Size</th>
					<th>Entry Price</th>
					<th>Mark Price</th>
					<th>Liq.Price</th>
					<th>Margin</th>
					<th>PNL</th>
				  </tr>
				</thead>
				<tbody>
				  <tr>
					<td colspan="8">There are no open position currently.</td>
				  </tr>
				</tbody>
			</table>
		</div>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>

		<script type="text/javascript" src="assets/js/chart.js"></script>
		<script type="text/javascript">

			jQuery ( document ).ready(function() {
				function add_tbody_data(){

					var response = JSON.parse( data_store );
					var tr = '';

					if( response.length > 0 ){

						for ( i = 0; i < response.length; i++ ) {

							var size = 2; 
							var pnl = parseFloat( response[i].unRealizedProfit ).toFixed(4);

							tr += '<tr><td data-label="Symbol" class="first-td"><div class="bar '+( response[i].positionAmt > 0 ? 'bar-buy' : 'bar-sell' )+'"></div><div class="symbol_bar">'+response[i].symbol+' Perpetual <span class="leverage">'+response[i].leverage+'x</span></div></td>';

							tr += '<td data-label="Size"><span class="'+( response[i].positionAmt > 0 ? 'size-buy' : 'size-sell' )+'">'+response[i].positionAmt+' '+ response[i].symbol.replace("USDT", "")+'</td>';

							tr += '<td data-label="Entry Price">'+parseFloat( response[i].entryPrice ).toFixed(4)+'</td>';
							tr += '<td data-label="Mark Price">'+parseFloat( response[i].markPrice ).toFixed(4)+'</td>';

							tr += '<td data-label="Liq.Price"><span class="liquidation_price-buy">'+parseFloat( response[i].liquidationPrice ).toFixed(4)+'</span></td>';
							tr += '<td data-label="Margin">'+parseFloat( response[i].isolatedMargin ).toFixed(4)+' ('+response[i].marginType+')</td>';
							tr += '<td data-label="PNL"><span class="'+( pnl > 0 ? 'pnl-buy' : 'pnl-sell' )+'">'+parseFloat( response[i].unRealizedProfit ).toFixed(4)+'</span></td></tr>';
						}
					}else{
						tr += '<tr><td colspan="7">There are no open position currently.</td></tr>';
					}
					jQuery( '.open_trades table' ).find( 'tbody' ).html( tr );
				}
				add_tbody_data();

				/* if( jQuery( document ).find('.chart_div').length > 0 ){ */

					setInterval(function (){
							jQuery( '.open_trades table' ).find( 'tbody' ).load('get-order-position-risk.php');
							return false;
					}, 3000, true);
				/* } */
			});
		</script>
	</body>
</html>
