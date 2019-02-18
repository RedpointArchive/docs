var ratingComplete = false;
var ratingRequestedInfo = false;

function submitFeedback(rating, additionalInfo) {
    ratingComplete = true;
    ratingRequestedInfo = false;
    $('#rating-box').addClass('rating-complete');
    $('#rating-title').text('Thanks for your feedback!');
    $('#rating-box svg[data-rating="star"]').each(function(elem) {
        if ($(this).attr('data-prefix') == 'fas') {
            $(this).addClass('text-warning');
        }
    });

    var env = 'unknown'
    if (window.location.hostname === 'localhost') {
        env = 'local';
    } else if (window.location.hostname === 'dev.hivemp.com') {
        env = 'development';
    } else if (window.location.hostname === 'hivemp.com') {
        env = 'production';
    }

    $.ajax({
        type: 'PUT',
        url: 'https://event-api.hivemp.com/v1/event/insert?eventType=DocumentationFeedback&eventTypeVersion=2',
        contentType: 'application/json',
        headers: {
            'X-API-Key': 'd546bc01478d2cd6d6132f6628609e82'
        },
        data: JSON.stringify({
            url: {
                full: window.location.href,
                path: window.location.pathname,
                hostname: window.location.hostname,
            },
            rating: rating,
            environment: env,
            additionalFeedback: additionalInfo
        })
    });
}

$(function() {
    var ratingBox = $('#rating-box');
    var selectedRating = null;

    var modal = $('#rating-info-required');
    if (modal == null || modal.length < 1) {
        modal = null;
    } else {
        modal.on('hidden.bs.modal', function() {
            ratingRequestedInfo = false;
            if (!ratingComplete) {
                selectedRating = null;
                $('#rating-title').text('How did we do?');
                $('#rating-box svg[data-rating="star"]').each(function(elem) {
                    $(this).attr('data-prefix', 'far');
                });
            }
        });
    }

    $('#rating-info-required-form').on('submit', function(e) {
        e.preventDefault();
        if (selectedRating != null && ratingRequestedInfo) {
            submitFeedback(selectedRating, $('#rating-info-required-additional-info').val());
            modal.modal('hide');
        }
    });
    $('#rating-info-required-submit').on('click', function(e) {
        e.preventDefault();
        if (selectedRating != null && ratingRequestedInfo) {
            submitFeedback(selectedRating, $('#rating-info-required-additional-info').val());
            modal.modal('hide');
        }
    });

    ratingBox.on('mouseenter', 'svg[data-rating="star"]', function() {
        var thisRating = $(this).attr('data-rating-value');
        if (!ratingComplete && selectedRating != thisRating) {
            selectedRating = thisRating;
            if (thisRating == 1) {
                $('#rating-title').text('Unusable');
            } else if (thisRating == 2) {
                $('#rating-title').text('Poor');
            } else if (thisRating == 3) {
                $('#rating-title').text('Okay');
            } else if (thisRating == 4) {
                $('#rating-title').text('Good');
            } else if (thisRating == 5) {
                $('#rating-title').text('Excellent');
            }
            $('#rating-box svg[data-rating="star"]').each(function() {
                if ($(this).attr('data-rating-value') <= thisRating) {
                    $(this).attr('data-prefix', 'fas');
                } else {
                    $(this).attr('data-prefix', 'far');
                }
            });
        }
    });
    ratingBox.on('click', function() {
        if (!ratingComplete && selectedRating != null) {
            if (selectedRating <= 4) {
                if (modal == null) {
                    submitFeedback(selectedRating, null);
                } else {
                    ratingRequestedInfo = true;
                    modal.modal();
                }
            } else {
                submitFeedback(selectedRating, null);
            }
        }
    });
    ratingBox.mouseleave(function() {
        window.setTimeout(function() {
            if (!ratingComplete && !ratingRequestedInfo) {
                selectedRating = null;
                $('#rating-title').text('How did we do?');
                $('#rating-box svg[data-rating="star"]').each(function(elem) {
                    $(this).attr('data-prefix', 'far');
                });
            }
        }, 16);
    });
})