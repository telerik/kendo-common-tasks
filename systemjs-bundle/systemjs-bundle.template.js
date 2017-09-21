<%= data.contents %>

<% for (let idx = 0; idx < data.modules.length; idx++) { %>
System.register('<%= data.packageName %>/<%= data.modules[idx]%>', ['<%= data.packageName %>'], function($__export) {
    var lib;

    return {
        setters: [function(dependency) {
            lib = dependency;
        }],
        execute: function() {
            $__export(lib.<%= data.modules[idx] %>);
        }
    };
});
<% } %>
