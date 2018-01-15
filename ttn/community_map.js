function draw_this_community(community) {
    var marker = new PruneCluster.Marker(community.lat, community.lon);

    marker.data.icon = window._icon.community;
    marker.data.popup = '<a href="' + community.path + '">' + community.title + '</a>';
    return marker;
}

function community_can_be_drawn(community) {
    if (community.lat && community.lon)
        return (true);
    else
        return (false)
}

function draw_communities(list_community) {
    var pruneCluster = window._data_community.cluster;

    pruneCluster.RemoveMarkers();
    for (var i = 0; i < list_community.length; i++) {
        if (community_can_be_drawn(list_community[i])) {
            pruneCluster.RegisterMarker(draw_this_community(list_community[i]));
        }
    }
    pruneCluster.ProcessView();
}

function fetch_display_community(url) {
    $.get(url, function(data) {
        draw_communities(data);

        // community_list.js function
        if (window.init_community_list_by_country)
          init_community_list_by_country(data);

        // fill the number of communities to the page
        $('.nb_community_filler').each(function() {
          $(this).html(data.length);
        });

        // fill the number of official communities to the page
        var nb_official_community = data.filter(function(c) { return c.official }).length;
        $('.nb_official_community_filler').each(function() {
          $(this).html(nb_official_community);
        });
    });
}

$(window).on('map:init', function (e) {
    var detail = e.originalEvent ? e.originalEvent.detail : e.detail;

    // filter out which map should be init
    if (detail.id != 'community_map')
        return ;

    // init the cluster map
    var map = detail.map;
    window._data_community = {
        cluster: new PruneClusterForLeaflet()
    };
    window._data_community.cluster.Cluster.Size = 1;
    map.addLayer(window._data_community.cluster);

    // some settings
    map.scrollWheelZoom.disable();
    map.setView([25, 0], 2);

    // fetch the data
    fetch_display_community(window._communities_list_url);
});
