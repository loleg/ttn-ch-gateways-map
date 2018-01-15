(function() {

    function get_icon(gateway) {
        if (gateway.status == 1)
            return window._icon.gateway_offline;
        if (gateway.status == 2)
            return window._icon.gateway_planned;
        return window._icon.gateway;
    }

    function draw_this_gateway(gateway) {
        var marker = new PruneCluster.Marker(gateway.lat, gateway.lon);

        marker.data.icon = get_icon(gateway);

        marker.data.popup = '<b>Name</b>: ' + (gateway.title ? gateway.title : 'Not specified') + '<br>';

        if (gateway.owner.username) {
            marker.data.popup += '<b>Owner</b>: <a href="/u/' + gateway.owner.username + '">' + gateway.owner.username + '</a><br>';
        } else {
            marker.data.popup += '<b>Owner</b>: Unknown owner<br>';
        }

        marker.data.popup += '<b>Altitude (m)</b>: ' + (gateway.altitude ? gateway.altitude : 'Not specified') + '<br>';
        marker.data.popup += '<b>Placement</b>: ' + (gateway.placement ? gateway.placement : 'Not specified') + '<br>';
        marker.data.popup += '<b>Brand</b>: ' + (gateway.brand ? gateway.brand : 'Not specified') + '<br>';
        marker.data.popup += '<b>Model</b>: ' + (gateway.model ? gateway.model : 'Not specified') + '<br>';
        marker.data.popup += '<b>Antenna model</b>: ' + (gateway.antenna_model ? gateway.antenna_model : 'Not specified');

        return marker;
    }

    function draw_gateway(list_gateway) {
        var pruneCluster = window._data_gateway.cluster;

        pruneCluster.RemoveMarkers();
        for (var i = 0; i < list_gateway.length; i++) {
            if (window._target_gateway == list_gateway[i].pk) {
                window._data_gateway.map.setZoom(12);
                window._data_gateway.map.panTo(new L.LatLng(list_gateway[i].lat, list_gateway[i].lon));
            }
            pruneCluster.RegisterMarker(draw_this_gateway(list_gateway[i]));
        }
        pruneCluster.ProcessView();
    }

    $(window).on('map:init', function (e) {

        var detail = e.originalEvent ?
                e.originalEvent.detail : e.detail;

        if (detail.id != 'gateway_map')
            return ;

        var map = detail.map;

        window._data_gateway = window._data || {};
        window._data_gateway.map = map;
        window._data_gateway.cluster = new PruneClusterForLeaflet();
        window._data_gateway.cluster.Cluster.Size = 5;

        map.addLayer(window._data_gateway.cluster);

        map.scrollWheelZoom.disable();
        map.on('focus', function() { map.scrollWheelZoom.enable(); });
        map.on('blur', function() { map.scrollWheelZoom.disable(); });

        map.setView([25, 0], 2);

        $.get(window._gateways_list_url, function(data) {
            window._gateway_list = data;
            draw_gateway(window._gateway_list);

            // fill the number of gateways to the page
            $('.nb_gateway_filler').each(function() {
              $(this).html(data.length);
            });
        });

    });

})();
