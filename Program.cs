using System;
using System.Text;

// To build in single file
// dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:PublishReadyToRun=true -p:PublishTrimmed=true -o ./publish

String fullPath = Directory.GetCurrentDirectory();
ConsoleKeyInfo key;

// CHECK FOR EXISTING CUE

String[] cueFiles = Directory.GetFiles(fullPath, "*.cue");

if (cueFiles.Length > 0)
{
    Console.WriteLine(".cue already exists. Press any key to delete and continue");
    key = Console.ReadKey();
    Console.WriteLine();

    foreach (String cueFile in cueFiles)
    {
        File.Delete(cueFile);
    }
}

// CREATE NEW CUE

StringBuilder text = new StringBuilder();

text.AppendLine("REM GENRE " + getGenre());
text.AppendLine("REM DATE " + getDate());
text.AppendLine("PERFORMER " + getPerformer());
text.AppendLine("TITLE " + getTitle());
text.Append(getTracks());

// CONFIRM CUE

Console.WriteLine("------------------------------");
Console.WriteLine(text.ToString());
Console.WriteLine("------------------------------");
Console.WriteLine("Press any key to continue");
key = Console.ReadKey();
Console.WriteLine();

// WRITE NEW CUE TO FILE AND EXIT

String path = getTitle() + ".cue";

using (StreamWriter writer = new StreamWriter(path, false))
{
    writer.Write(text.ToString());
}

// UTILS
String getGenre()
{
    Console.Write("Type the genre: ");
    String genre = Console.ReadLine();

    genre = genre.Substring(0, 1).ToUpper() + genre.Substring(1).ToLower();

    return genre;
}

String getDate()
{
    String[] dateAlbum = fullPath.Split('\\');
    String date = dateAlbum[dateAlbum.Length - 1].Split('-')[0].Trim();

    return date;
}

String getPerformer()
{
    String[] dateAlbum = fullPath.Split('\\');
    String performer = dateAlbum[dateAlbum.Length - 2].Trim();

    return performer;
}

String getTitle()
{
    String[] dateAlbum = fullPath.Split('\\');
    String title = dateAlbum[dateAlbum.Length - 1].Split('-')[1].Trim();

    return title;
}

String getTracks() {

    StringBuilder tracks = new StringBuilder();

    String mostUsedExtension = getMostUsedExtension();
    String searchMask = "*" + mostUsedExtension;

    String[] allTracks = Directory.GetFiles(fullPath, searchMask);


    for (int i = 0; i < allTracks.Length; i++)
    {
        // FILE
        String[] directories = allTracks[i].Split("\\");
        String file = directories[directories.Length - 1];
        tracks.AppendLine("FILE \"" + file + "\" FLAC");

        // TRACK
        String track = iteratorToNumber(i);
        tracks.AppendLine(String.Format("\tTRACK {0} AUDIO", track));

        // TITLE
        String title = fileToTitle(file, mostUsedExtension);
        tracks.AppendLine("\tTITLE \"" + title + "\"");

        // INDEX
        tracks.AppendLine("\t\tINDEX 01 00:00:00");
    }

    return tracks.ToString();
}

String iteratorToNumber(int iterator)
{
    String number;
    iterator++;

    if (iterator < 10)
    {
        number = "0" + iterator.ToString();
    }
    else
    {
        number = iterator.ToString();
    }

    return number;
}

String fileToTitle(String file, String extension)
{
    String title = file.Replace(extension, "").Trim();
    String possibleNumber = title.Split(" ")[0];

    foreach (char c in possibleNumber.ToCharArray())
    {
        if (Char.IsDigit(c))
        {
            title = title.Replace(possibleNumber, "").Trim();
            break;
        }
    }

    String possibleMark = title.Split(" ")[0];

    foreach (char c in possibleMark.ToCharArray())
    {
        if (!Char.IsLetter(c))
        {
            title = title.Replace(possibleMark, "").Trim();
            break;
        }
    }

    return title;
}

String getMostUsedExtension()
{
    // most possible extension
    String mostUsedExtension = ".flac";

    String[] files = Directory.GetFiles(fullPath);
    List<String> allExtensions = new List<String> ();

    // get all extensions
    foreach(String file in files)
    {
        allExtensions.Add(Path.GetExtension(file));
    }

    // remove duplicates
    List<String> uniqueExtensions = allExtensions.Distinct().ToList();

    // count extensions by uses
    int maxCount = 0;
    int currentCount;

    for (int i = 0; i < uniqueExtensions.Count; i++)
    {
        currentCount = 0;

        foreach(String extension in allExtensions)
        {
            if (extension.Equals(uniqueExtensions[i]))
            {
                currentCount++;
            }
        }

        if (currentCount > maxCount)
        {
            maxCount = currentCount;
            mostUsedExtension = uniqueExtensions[i];
        }
    }

    return mostUsedExtension;
}