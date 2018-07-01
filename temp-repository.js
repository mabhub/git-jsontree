const Gitty    = require('gitty');
const Command  = require('gitty/lib/command.js');
const tmp      = require('tmp');

class TempRepository {
  constructor () {
    this.settings = {
      commitCount: 0,
      branches: [
        'master',
        'myBranch',
      ],
      user: {
        name: 'git-jsontree',
        email: 'git@jsontree.dev',
      },
      comment () {
        return `git-jsontree (${Math.random()})`;
      },
    };

    this.tmpDir = tmp.dirSync({ unsafeCleanup: true });
    this.repo = new Gitty(this.tmpDir.name);
    this.path = this.tmpDir.name;

    this.repo.initSync();

    const commands = [
      new Command(this.repo, `config --local user.name ${this.settings.user.name}`),
      new Command(this.repo, `config --local user.email ${this.settings.user.email}`),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, `checkout -b ${this.settings.branches[1]} HEAD~2`),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, 'checkout master'),
      new Command(this.repo, this.mergeCmd()),
      new Command(this.repo, this.commitCmd()),
      new Command(this.repo, 'checkout --detach'),
    ];

    commands.map(cmd => cmd.execSync());
  }

  commitCmd () {
    this.settings.commitCount += 1;
    return `commit --allow-empty -m "${this.settings.comment()}"`;
  }

  mergeCmd () {
    this.settings.commitCount += 1;
    return `merge --no-ff ${this.settings.branches[1]}`;
  }

  clean () {
    this.tmpDir.removeCallback();
  }
}

module.exports = TempRepository;
