    $(function() {
        $("#search").autocomplete({
            source: "/autosuggest",
            minLength: 1,
            select: function(event, ui) {
                $('#search').val(ui.item.id);
            }
        });
    });
