# opens a file 'outfile' where we will write all the triples
# this file already contains the right prefixes and some rdf:type statements for the properties
outfile = open("imdbData.ttl", "a", encoding="utf-8")

# open both the basics and ratings files and run some code on it
with open("basics.tsv", encoding="utf-8") as basics, open("ratings.tsv", encoding="utf-8") as ratings:
    genrelist = [] # a list/array containing all the genres we encounter (for inferencing later)

    # we skip the first line in basics.tsv and ratings.tsv and start looking at the second line
    # we also already split the ratings line (rLine)
    line = basics.readline()
    line = basics.readline()
    rLine = ratings.readline()
    rLine = ratings.readline()
    rLine = rLine.split("\t")

    # we keep looping until line or rLine returns false
    while line and rLine:

        # we set up some starting values and some variables we will need later
        hasRating = False
        line = line.split("\t")
        type = line[1]
        if rLine[0][2:] != "":
            rId = int(rLine[0][2:])
        ogId = line[0]
        id = int(line[0][2:])

        # due to an inconsistency in the IDs we have to skip some lines in the ratings file
        while rId > 9999999:
            rLine = ratings.readline()
            rLine = rLine.split("\t")
            rId = int(rLine[0][2:])

        # if the piece of content has a rating we say that it has a rating and show the number of votes
        # then we go to the next line in the ratings file and split it
        if id == rId:
            hasRating = True
            rating = rLine[1]
            votes = int(rLine[2])
            rLine = ratings.readline()
            rLine = rLine.split("\t")

        # if the type of content is a movie and it has a rating and the number of votes is at least 1000
        # we put the relevant information into our .ttl file
        if type == "movie" and hasRating and votes > 999:

            # we make a new line/instance to add to our file
            # and add the relevant information to the instance in turtle syntax
            ttlLine = ""
            title = line[2].replace(" ", "_").replace('"', "'")
            year = line[5]
            runtime = line[7]
            line[8] = line[8][:-1]
            genres = line[8].split(",")

            ttlLine += "id:" + ogId + " a id:Film ; \n"
            ttlLine += '    id:hasTitle "' + title + '" ; \n'
            ttlLine += "    id:hasRating " + rating + " ; \n"
            if year != '\\N':
                ttlLine += "    id:hasReleaseDate " + year + " ; \n"
            if runtime != '\\N':
                ttlLine += "    id:hasRuntime " + runtime + " ; \n"
            for g in genres:
                if g != '\\N':
                    ttlLine += "    id:hasGenre id:" + g + " ; \n"
                    if g not in genrelist:
                        genrelist.append(g)
            ttlLine = ttlLine[:-3]
            ttlLine += ". \n"

            # with all the information of the instance the variable we add it to the .ttl file
            outfile.write(ttlLine)

        # and we go to the next line in basics.tsv
        line = basics.readline()

    # after all lines and thus all instances we add all the genres to the file to make sure it sees them
    # as different instances
    ttlLine = "[ rdf:type owl:AllDifferent ; \n"
    ttlLine += "    owl:distinctMembers ( \n"
    for gen in genrelist:
        ttlLine += "        id:" + gen + "\n"
    ttlLine += "       ) \n"
    ttlLine += "] ."
    outfile.write(ttlLine)

# then we close all files (basics.tsv and ratings.tsv are closed automatically by the with statement
outfile.close()