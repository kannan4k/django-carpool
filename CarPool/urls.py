from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'CarPool.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^welcome/$', 'WebUI.views.welcome'),
    url(r'^new_trip/$', 'WebUI.views.new_trip'),
    url(r'^home/$', 'WebUI.views.home'),
    url(r'^signup/','WebUI.views.signup'),
    url(r'^login/','WebUI.views.signin'),
    url(r'^save_journey/$', 'WebUI.views.save_journey'),
    url(r'^logout/$', 'WebUI.views.logout_view'),
    url(r'^search_trip/$', 'WebUI.views.search_trip'),
    url(r'^get_results/$','WebUI.views.get_results'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^search_results/$', 'WebUI.views.search_results'),
    url(r'^request_success/$','WebUI.views.request_success'),
    url(r'^send_request/$','WebUI.views.send_request'),
)
