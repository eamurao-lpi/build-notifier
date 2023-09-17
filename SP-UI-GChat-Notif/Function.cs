using Amazon.Lambda.Core;
using Amazon.Lambda.SNSEvents;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace SP_UI_GChat_Notif;

public class Function
{
    string gChatWebhook = "https://chat.googleapis.com/v1/spaces/AAAAMHZG3CY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=pkXs2RzQahn8PK5fxJ7Y3_Pg1xMuy-W1MehJSSpmqxs";
    /// <summary>
    /// A simple function that takes a string and does a ToUpper
    /// </summary>
    /// <param name="input"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public async Task<bool> FunctionHandler(SNSEvent input, ILambdaContext context)
    {
        try
        {

            var msg = new gContent
            {
                text = input.Records[0].Sns.Message,
            };

            var json = JsonConvert.SerializeObject(msg);

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(gChatWebhook);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var requestContent = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(client.BaseAddress, requestContent).ConfigureAwait(false);
            }
            return true;
        }
        catch (Exception ex)
        {
            return false;
            throw;
        }
    }
}


internal class gContent
{
    public string text;
}