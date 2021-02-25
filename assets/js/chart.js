var burl = 'https://fapi.binance.com/';
var query = 'fapi/v1/klines?interval=5m';

var limit = 200; 
var interval = 1000;

var all_symbol_js = JSON.parse( all_symbol );
var all_orders = JSON.parse( open_orders );

var main_width = ( document.body.offsetWidth <= 567 ? document.body.offsetWidth : document.body.offsetWidth / 2 - 13);
var main_height = 350;

var all_entry_price = JSON.parse( data_store );

function create_light_weight_chart( div_id = null ){
	
	if( div_id ){
		return LightweightCharts.createChart( document.getElementById( div_id ), {
			width: main_width - 3,
			height: main_height,
			layout: {
				backgroundColor: '#191919',
				textColor: 'rgba(255, 255, 255, 0.9)',
			},
			grid: {
				vertLines: {
					color: '#2b2b2b',
				},
				horzLines: {
					color: '#2b2b2b',
				},
			},
			crosshair: {
				mode: LightweightCharts.CrosshairMode.Normal,
			},
			rightPriceScale: {
				borderColor: '#2b2b2b',
			},
			timeScale: {
				timeVisible: true,
				borderColor: '#2b2b2b',
			},
		});
	}
}

function add_Candle_stick_series_color( chart_name = null ){
	
	if( chart_name ){
		
		return chart_name.addCandlestickSeries({ priceFormat: { precision:4 },

		  upColor: 'rgb(2, 192, 118)',
		  downColor: 'rgb(248, 73, 96)',
		  borderDownColor: 'rgb(248, 73, 96)',
		  borderUpColor: 'rgb(2, 192, 118)',
		  wickDownColor: 'rgb(248, 73, 96)',
		  wickUpColor: 'rgb(2, 192, 118)',

		});
	}
}

if( all_symbol_js && all_symbol_js.length > 0 ){

	/* Chart 01  */
	var chart_01 = create_light_weight_chart( 'chart_div1' );
	var candleSeries_01 = add_Candle_stick_series_color( chart_01 );
	
	var symbol_01 = all_symbol_js[0];

	clearInterval();
	setInterval( function(){

		var ourRequest_01 = null;
		var url_01 = burl + query + '&symbol='+symbol_01+'&limit=1';

		ourRequest_01 = new XMLHttpRequest();
		ourRequest_01.open('GET',url_01,true);

		ourRequest_01.onload = function(){

			var response_01 = JSON.parse( ourRequest_01.responseText );

			candleSeries_01.update({
				
				time : response_01[0][0] / 1000,
				open: response_01[0][1],
				high: response_01[0][2],
				low: response_01[0][3],
				close: response_01[0][4],
			});
		}
		ourRequest_01.send(null);

	}, interval, true);

	jQuery( '#chart_div1' ).find( '.chart_title' ).html( '#'+symbol_01 );
	var url_01 = burl + query + '&symbol='+symbol_01+'&limit='+limit;

	var ourRequest_01 = new XMLHttpRequest();
	ourRequest_01.open('GET',url_01,true);

	ourRequest_01.onload = function(){

		var response_01 = JSON.parse( ourRequest_01.responseText );
		var arr = new Array();

		if( response_01.length > 0 ){

			for ( i = 0; i < response_01.length; i++ ) {
			   arr.push({

					time : response_01[i][0] / 1000,
					open: response_01[i][1],
					high: response_01[i][2],
					low: response_01[i][3],
					close: response_01[i][4],
				});
			}
			candleSeries_01.setData( arr );

			if( all_orders && all_orders.length > 0 ){
				
				for ( i = 0; i < all_orders.length; i++ ) {
					
					if( all_orders[i].symbol == symbol_01 ){

						var color = ( all_orders[i].side == 'BUY' ? '#be1238' : 'rgb(2, 192, 118)' );
						var PriceLine = {
							price: all_orders[i].price,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_01.createPriceLine( PriceLine );
					}
				}
			}
			
			if( all_entry_price && all_entry_price.length > 0 ){
				
				for ( i = 0; i < all_entry_price.length; i++ ) {
					
					if( all_entry_price[i].symbol == symbol_01 ){
						
						var color = ( all_entry_price[i].positionAmt > 0 ? '#be1238' : 'rgb(2, 192, 118)');
						var PriceLine_ent = {
							price: all_entry_price[i].entryPrice,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_01.createPriceLine( PriceLine_ent );
						
					}
				}
			}
		}
	}
	ourRequest_01.send();
}
if( all_symbol_js && all_symbol_js.length > 1 ){

	/* Chart 02  */
	var chart_02 = create_light_weight_chart( 'chart_div2' );
	var candleSeries_02 = add_Candle_stick_series_color( chart_02 );

	var symbol_02 = all_symbol_js[1];

	clearInterval();
	setInterval( function(){

		var ourRequest_02 = null;
		var url_02 = burl + query + '&symbol='+symbol_02+'&limit=1';

		ourRequest_02 = new XMLHttpRequest();
		ourRequest_02.open('GET',url_02,true);

		ourRequest_02.onload = function(){

			var response_02 = JSON.parse( ourRequest_02.responseText );

			candleSeries_02.update({
				
				time : response_02[0][0] / 1000,
				open: response_02[0][1],
				high: response_02[0][2],
				low: response_02[0][3],
				close: response_02[0][4],
			});
		}
		ourRequest_02.send(null);

	}, interval, true);

	jQuery( '#chart_div2' ).find( '.chart_title' ).html( '#'+symbol_02 );
	var url_02 = burl + query + '&symbol='+symbol_02+'&limit='+limit;

	var ourRequest_02 = new XMLHttpRequest();
	ourRequest_02.open('GET',url_02,true);

	ourRequest_02.onload = function(){

		var response_02 = JSON.parse( ourRequest_02.responseText );

		var arr_02 = new Array();

		if( response_02.length > 0 ){

			for ( i = 0; i < response_02.length; i++ ) {
			   arr_02.push({

					time : response_02[i][0] / 1000,
					open: response_02[i][1],
					high: response_02[i][2],
					low: response_02[i][3],
					close: response_02[i][4],
				});
			}
			candleSeries_02.setData( arr_02 );

			if( all_orders && all_orders.length > 0 ){
				
				for ( i = 0; i < all_orders.length; i++ ) {
					
					if( all_orders[i].symbol == symbol_02 ){

						var color = ( all_orders[i].side == 'BUY' ? '#be1238' : 'rgb(2, 192, 118)' );
						var PriceLine = {
							price: all_orders[i].price,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_02.createPriceLine( PriceLine );
					}
				}
			}
			
			if( all_entry_price && all_entry_price.length > 0 ){
				
				for ( i = 0; i < all_entry_price.length; i++ ) {
					
					if( all_entry_price[i].symbol == symbol_02 ){
						
						var color = ( all_entry_price[i].positionAmt > 0 ? '#be1238' : 'rgb(2, 192, 118)' );
						var PriceLine_ent = {
							price: all_entry_price[i].entryPrice,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_02.createPriceLine( PriceLine_ent );						
					}
				}
			}
		}
	}
	ourRequest_02.send();
}

if( all_symbol_js && all_symbol_js.length > 2 ){

	/* Chart 03  */
	var chart_03 = create_light_weight_chart( 'chart_div3' );
	var candleSeries_03 = add_Candle_stick_series_color( chart_03 );

	var symbol_03 = all_symbol_js[2];

	clearInterval();
	setInterval( function(){

		var ourRequest_03 = null;
		var url_03 = burl + query + '&symbol='+symbol_03+'&limit=1';

		ourRequest_03 = new XMLHttpRequest();
		ourRequest_03.open( 'GET', url_03, true );

		ourRequest_03.onload = function(){

			var response_03 = JSON.parse( ourRequest_03.responseText );

			candleSeries_03.update({
				
				time : response_03[0][0] / 1000,
				open: response_03[0][1],
				high: response_03[0][2],
				low: response_03[0][3],
				close: response_03[0][4],
			});
		}
		ourRequest_03.send(null);
	}, interval, true);

	jQuery( '#chart_div3' ).find( '.chart_title' ).html( '#'+symbol_03 );
	var url_03 = burl + query + '&symbol='+symbol_03+'&limit='+limit;

	var ourRequest_03 = new XMLHttpRequest();
	ourRequest_03.open( 'GET', url_03, true );

	ourRequest_03.onload = function(){

		var response_03 = JSON.parse( ourRequest_03.responseText );
		var arr_03 = new Array();

		if( response_03.length > 0 ){

			for ( i = 0; i < response_03.length; i++ ) {
			   arr_03.push({

					time : response_03[i][0] / 1000,
					open: response_03[i][1],
					high: response_03[i][2],
					low: response_03[i][3],
					close: response_03[i][4],
				});
			}
			candleSeries_03.setData( arr_03 );

			if( all_orders && all_orders.length > 0 ){
				
				for ( i = 0; i < all_orders.length; i++ ) {
					
					if( all_orders[i].symbol == symbol_03 ){

						var color = ( all_orders[i].side == 'BUY' ? '#be1238' : 'rgb(2, 192, 118)' );
						var PriceLine = {
							price: all_orders[i].price,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_03.createPriceLine( PriceLine );
					}
				}
			}
			
			if( all_entry_price && all_entry_price.length > 0 ){
				
				for ( i = 0; i < all_entry_price.length; i++ ) {
					
					if( all_entry_price[i].symbol == symbol_03 ){
						
						var color = ( all_entry_price[i].positionAmt > 0 ? '#be1238' : 'rgb(2, 192, 118)' );
						var PriceLine_ent = {
							price: all_entry_price[i].entryPrice,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_03.createPriceLine( PriceLine_ent );
						
					}
				}
			}
		}
	}
	ourRequest_03.send();
}

if( all_symbol_js && all_symbol_js.length > 3 ){

	/* Chart 04 */
	var chart_04 = create_light_weight_chart( 'chart_div4' );
	var candleSeries_04 = add_Candle_stick_series_color( chart_04 );

	var symbol_04 = all_symbol_js[3];

	clearInterval();
	setInterval( function(){

		var ourRequest_04 = null;
		var url_04 = burl + query + '&symbol='+symbol_04+'&limit=1';

		ourRequest_04 = new XMLHttpRequest();
		ourRequest_04.open( 'GET', url_04, true );

		ourRequest_04.onload = function(){

			var response_04 = JSON.parse( ourRequest_04.responseText );

			candleSeries_04.update({
				
				time : response_04[0][0] / 1000,
				open: response_04[0][1],
				high: response_04[0][2],
				low: response_04[0][3],
				close: response_04[0][4],
			});
		}
		ourRequest_04.send(null);

	}, interval, true);

	jQuery( '#chart_div4' ).find( '.chart_title' ).html( '#'+symbol_04 );
	var url_04 = burl + query + '&symbol='+symbol_04+'&limit='+limit;

	var ourRequest_04 = new XMLHttpRequest();
	ourRequest_04.open( 'GET', url_04, true );

	ourRequest_04.onload = function(){

		var response_04 = JSON.parse( ourRequest_04.responseText );
		var arr_04 = new Array();

		if( response_04.length > 0 ){

			for ( i = 0; i < response_04.length; i++ ) {
			   arr_04.push({

					time : response_04[i][0] / 1000,
					open: response_04[i][1],
					high: response_04[i][2],
					low: response_04[i][3],
					close: response_04[i][4],
				});
			}
			candleSeries_04.setData( arr_04 );

			if( all_orders && all_orders.length > 0 ){
				
				for ( i = 0; i < all_orders.length; i++ ) {
					
					if( all_orders[i].symbol == symbol_04 ){

						var color = ( all_orders[i].side == 'BUY' ? '#be1238' : 'rgb(2, 192, 118)' );
						var PriceLine = {
							price: all_orders[i].price,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_04.createPriceLine( PriceLine );
					}
				}
			}
			
			if( all_entry_price && all_entry_price.length > 0 ){
				
				for ( i = 0; i < all_entry_price.length; i++ ) {
					
					if( all_entry_price[i].symbol == symbol_04 ){
						
						var color = ( all_entry_price[i].positionAmt > 0 ? '#be1238' : 'rgb(2, 192, 118)' );
						var PriceLine_ent = {
							price: all_entry_price[i].entryPrice,
							color: color,
							lineWidth: 2,
							lineStyle: LightweightCharts.LineStyle.Dashed,
						};
						candleSeries_04.createPriceLine( PriceLine_ent );
						
					}
				}
			}
		}
	}
	ourRequest_04.send();
}