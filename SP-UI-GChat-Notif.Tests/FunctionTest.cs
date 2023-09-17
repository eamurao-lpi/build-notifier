using Xunit;
using Amazon.Lambda.Core;
using Amazon.Lambda.TestUtilities;
using Amazon.Lambda.SNSEvents;

namespace SP_UI_GChat_Notif.Tests;

public class FunctionTest
{
    [Fact]
    public void TestToUpperFunction()
    {

        // Invoke the lambda function and confirm the string was upper cased.
        var function = new Function();
        var context = new TestLambdaContext();
        SNSEvent sNSEvent = new SNSEvent();
        var record = new SNSEvent.SNSRecord();
        record.Sns = new SNSEvent.SNSMessage
        {
            Message = "test"
        };
        
        sNSEvent.Records.Add(record);

        var upperCase = function.FunctionHandler(sNSEvent, context).Result;

        //Assert.Equal("HELLO WORLD", upperCase);
    }
}
