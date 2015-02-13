angular.module('koan.home').directive( 'compilator', function ( $compile ) {
    return {
        scope: true,
        link: function ( scope, element, attrs ) {
            var elmnt;
            attrs.$observe( 'template', function ( myTemplate ) {
                if ( angular.isDefined( myTemplate ) ) {
                    elmnt = $compile( '<div>' + myTemplate + '</div>')( scope );
                    element.html("");
                    element.append( elmnt );
                }
            });
        }
    };
});