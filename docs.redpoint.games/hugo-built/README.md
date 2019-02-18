# Custom version of Hugo

Built with:

```
go get github.com/magefile/mage
go get -d github.com/gohugoio/hugo
cd $env:USERPROFILE\go\src\github.com\gohugoio\hugo
git remote add fork https://github.com/hach-que/hugo
git checkout -f fork/master
mage vendor
mage install
```