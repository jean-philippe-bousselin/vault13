/**
 * A generic confirmation for risky actions.
 * Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
 */
angular.module('koan.common').directive('confirm', [function() {

    function createModal() {
        $('body').append(
            '<div id="smallModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="smallModal" aria-hidden="true">' +
                '<div class="modal-dialog modal-sm">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header"></div>' +
                        '<div class="modal-body text-center"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }

    function getButtons() {
        return '<button type="button" class="btn btn-danger confirm" data-dismiss="modal">Do it!</button> ' +
            '<button type="button" class="btn btn-default decline" data-dismiss="modal">Cancel</button>';
    }

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                createModal();
                $('#smallModal .modal-header').html(attrs.message);
                $('#smallModal .modal-body').html(getButtons());
                $('#smallModal .modal-body .confirm').on('click', function(){
                    scope.$apply(attrs.callback);
                });
                $('#smallModal').modal('show');
                $('#smallModal').on('hidden.bs.modal', function (e) {
                    $('#smallModal').remove();
                });
            });
        }
    }
}]);