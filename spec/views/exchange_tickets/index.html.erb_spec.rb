require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/exchange_tickets/index" do
  before(:each) do
    render 'exchange_tickets/index'
  end

  #Delete this example and add some real ones or delete this file
  it "should tell you where to find the file" do
    response.should have_tag('h2')
  end
end
